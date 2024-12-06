// src/controllers/magic.service.ts
import LoggerService from "@resources/logger/logger.service";
import { MiningAccountWithPoolAndProxy } from "@resources/miningAccount/miningAccount.service";
import { HashrateConverter } from "@utils/functions";
import { prisma } from "@utils/prismaClient";
import redisClient from "@utils/redisClient";

class MagicService {
    private log = new LoggerService();

    /**
     * Populates Redis with mining accounts for a given client without overwriting existing data.
     *
     * @param clientID ID of the client.
     * @param miningAccounts List of mining accounts to populate.
     * @returns Promise<void>
     */
    public populateMiningAccountsInRedis = async (
        clientID: string,
        miningAccounts: MiningAccountWithPoolAndProxy[]
    ): Promise<void> => {
        const miningAccountsKey = `client:{123}:${clientID}:miningAccounts`;
        
        // Add all miningAccountIDs to the client's set
        const miningAccountWorkerNames = miningAccounts.map(account => account.workerName);
        if (miningAccountWorkerNames.length > 0) {
            await redisClient.sadd(miningAccountsKey, miningAccountWorkerNames);
        }
        
        // For each mining account, create a hash with necessary details only if it doesn't exist
        for (const account of miningAccounts) {
            //Constructs the worker name workerName.workerPrefix
            const workerName = account.workerName;
            const workerNameWithPrefix = `${workerName}.${Math.floor(Math.random() * 999) + 1}`;
            const miningAccountKey = `miningAccount:{123}:${workerName}`;

            // Start a transaction
            const multi = redisClient.multi();

            // Check if the miningAccountKey exists
            multi.exists(miningAccountKey);

            // Execute the transaction
            const replies = await multi.exec();
            if (!replies || replies.length === 0) {
                this.log.createLog("ERROR", `Redis transaction failed for mining account '${workerName}'.`, "");
                continue;
            }

            const [error, result] = replies[0];

            if (error) {
                this.log.createLog("ERROR", `Redis error while checking mining account '${workerName}'.`, error.message);
                continue;
            }

            const exists = result === 1;


            if (!exists) {
                // If the mining account doesn't exist, set the hash fields
                multi.hmset(miningAccountKey, {
                    pool_worker_name: workerNameWithPrefix,
                    account_id: account.id, // Ensure `workerName` is part of `MiningAccountWithPoolAndProxy`
                    hashrate_limit: HashrateConverter.petahashesToHashes(account.hashrateLimitPh),
                    multiplication_factor: account.multiplicationFactor.toString(),
                    clientID: account.clientId.toString(),
                    coin: account.coin,
                });

                // Initialize the sorted set for shares if not already present
                const sharesKey = `shares:{123}:${workerName}`;
                multi.exists(sharesKey);

                // Execute the transaction
                const setReplies = await multi.exec();
                if (!setReplies || setReplies.length < 2) {
                    this.log.createLog("ERROR", `Redis transaction failed while setting mining account '${workerName}'.`, "");
                    continue;
                }

                const [setError, setResult] = setReplies[0];
                const [sharesExistsError, sharesExistsResult] = setReplies[1];

                if (setError) {
                    this.log.createLog("ERROR", `Redis error while setting mining account '${workerName}'.`, setError.message);
                    continue;
                }

                if (sharesExistsError) {
                    this.log.createLog("ERROR", `Redis error while checking shares for mining account '${workerName}'.`, sharesExistsError.message);
                    continue;
                }

                const sharesExists = sharesExistsResult === 1;


                if (!sharesExists) {
                    // Initialize shares sorted set
                    const zaddReply = await redisClient.zadd(sharesKey, 0, ""); // Initialize with a dummy value or leave empty
                    if (zaddReply !== 0) {
                        this.log.createLog("ERROR", `Redis error while initializing shares for mining account '${workerName}'.`, "");
                    }
                }

            } else {
            }
        }
    }

    public getRandomProxy = async () => {
        const proxies = await prisma.proxy.findMany();
        const randomProxy = proxies[Math.floor(Math.random() * proxies.length)];
        return randomProxy;
    }

}

export default MagicService;

import ping from 'ping';

export const pingServer = async (ip: string): Promise<boolean> => {
    const res = await ping.promise.probe(ip);
    return res.alive;
}

export class HashrateConverter {
    // Converts petahashes per second (PH/s) to hashes per second (H/s)
    static petahashesToHashes(ph: number): number {
      return ph * 1e15;
    }
  
    // Converts terahashes per second (TH/s) to hashes per second (H/s)
    static terahashesToHashes(th: number): number {
      return th * 1e12;
    }
  
    // Converts gigahashes per second (GH/s) to hashes per second (H/s)
    static gigahashesToHashes(gh: number): number {
      return gh * 1e9;
    }
  
    // Converts megahashes per second (MH/s) to hashes per second (H/s)
    static megahashesToHashes(mh: number): number {
      return mh * 1e6;
    }
  
    // Converts kilohashes per second (kH/s) to hashes per second (H/s)
    static kilohashesToHashes(kh: number): number {
      return kh * 1e3;
    }
  
    // Converts hashes per second (H/s) to petahashes per second (PH/s)
    static hashesToPetahashes(h: number): number {
      return h / 1e15;
    }
  
    // Converts hashes per second (H/s) to terahashes per second (TH/s)
    static hashesToTerahashes(h: number): number {
      return h / 1e12;
    }
  
    // Converts hashes per second (H/s) to gigahashes per second (GH/s)
    static hashesToGigahashes(h: number): number {
      return h / 1e9;
    }
  
    // Converts hashes per second (H/s) to megahashes per second (MH/s)
    static hashesToMegahashes(h: number): number {
      return h / 1e6;
    }
  
    // Converts hashes per second (H/s) to kilohashes per second (kH/s)
    static hashesToKilohashes(h: number): number {
      return h / 1e3;
    }
  }
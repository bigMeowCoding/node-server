import { glob } from "glob";

const MOCK_FILE_GLOB = "mock/**/*.[jt]s";

export function getMockData() {
  const ret = [MOCK_FILE_GLOB]
    .reduce<string[]>((memo, pattern) => {
      memo.push(...glob.sync(pattern));
      return memo;
    }, [])
    .reduce<Record<string, any>>((memo, file) => {
      const mockFile = `${process.cwd()}/${file}`;
      let m;
      try {
        m = require(mockFile);
      } catch (e) {
        throw new Error(
          `Mock file ${mockFile} parse failed.\n${(e as Error).message}`
        );
      }
      const obj = m?.default || m || {};
      console.log(obj);
      for (const key of Object.keys(obj)) {
      }
      return memo;
    }, {});
}

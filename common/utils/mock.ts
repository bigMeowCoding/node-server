import { glob } from "glob";

const MOCK_FILE_GLOB = "mock/**/*.[jt]s";
export const DEFAULT_METHOD = "POST";

export interface IMock {
  method: string;
  path: string;
  handler: Function;
  file?: string;
}
function parseKey(key: string) {
  const spliced = key.split(/\s+/);
  const len = spliced.length;
  if (len === 1) {
    return { method: DEFAULT_METHOD, path: key };
  } else {
    const [method, path] = spliced;
    const upperMethod = method.toUpperCase();
    return { method: upperMethod, path };
  }
}

function getMock(param: { obj: any; key: string }): IMock {
  const { obj, key } = param;
  const { method, path } = parseKey(param.key);
  return {
    method,
    path,
    handler: obj[key],
  };
}

export function getMockData() {
  const ret = [MOCK_FILE_GLOB]
    .reduce<string[]>((memo, pattern) => {
      memo.push(...glob.sync(pattern));
      return memo;
    }, [])
    .reduce<Record<string, any>>((memo, file) => {
      console.log(memo);
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
        const mock = getMock({ key, obj });
        mock.file = mockFile;
        const id = `${mock.method} ${mock.path}`;
        if (!memo[id]) {
          memo[id] = mock;
        }
      }
      return memo;
    }, {});
  return ret;
}

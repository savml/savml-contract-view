import { v0, CrossFetchProvider, UrlLoader } from "savml";
import { UNPKG_URL } from "./remote";
export function getFactory() {
  let factory = v0();
  let loader = factory.getLoaderFactory();
  loader.useLoaderProvider(
    new UrlLoader([{ url: UNPKG_URL }], new CrossFetchProvider())
  );
  return factory;
}

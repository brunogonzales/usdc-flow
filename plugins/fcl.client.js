import * as fcl from "@onflow/fcl";
export default function ({ app }, inject) {
  fcl
    .config()
    .put("accessNode.api", "https://access-testnet.onflow.org")
    .put("discovery.wallet", "https://fcl-discovery.onflow.org/testnet/authn")
    .put("app.detail.title", "FCL example")
    .put("0xFiatToken", "0xa983fecbed621163");
  inject("fcl", fcl);
}

import * as fcl from "@onflow/fcl";
export default function ({ app }, inject) {
  fcl
    .config()
    .put("accessNode.api", "https://access-testnet.onflow.org")
    .put("discovery.wallet", "https://fcl-discovery.onflow.org/testnet/authn")
    .put("app.detail.title", "FCL example");
  // .put("0xFlowToken", "0x7e60df042a9c0868");
  inject("fcl", fcl);
}

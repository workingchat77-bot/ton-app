const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
  manifestUrl: "https://workingchat77.github.io/ton-app/tonconnect-manifest.json"
});

tonConnectUI.renderWalletButton("#ton-connect-button");

tonConnectUI.onStatusChange((walletInfo) => {
  const el = document.getElementById("wallet-address");

  if (!walletInfo) {
    el.textContent = "Кошелёк не подключен";
    return;
  }

  el.textContent = "Подключен кошелёк: " + walletInfo.account.address;
});

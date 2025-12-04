const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
  manifestUrl: "https://workingchat77-bot.github.io/ton-app/tonconnect-manifest.json"
});

tonConnectUI.renderWalletButton("#ton-connect-button");

tonConnectUI.onStatusChange((walletInfo) => {
  const el = document.getElementById("wallet-address");

  if (!walletInfo) {
    el.textContent = "Кошелёк не подключен";
    return;
  }

  el.textContent = "Подключен: " + walletInfo.account.address;
});

document.getElementById("pay-btn").onclick = async () => {
  const amountStr = document.getElementById("pay-amount").value;
  const toAddress = document.getElementById("pay-to").value.trim();
  const status = document.getElementById("pay-status");

  if (!amountStr || Number(amountStr) <= 0) {
    status.textContent = "Укажи сумму";
    return;
  }

  if (!toAddress) {
    status.textContent = "Укажи адрес получателя";
    return;
  }

  try {
    status.textContent = "Подтверди в Tonkeeper...";

    const amountNano = Math.floor(Number(amountStr) * 1e9);

    await tonConnectUI.sendTransaction({
      validUntil: Math.floor(Date.now() / 1000) + 300,
      messages: [
        {
          address: toAddress,
          amount: amountNano.toString()
        }
      ]
    });

    status.textContent = "Транзакция отправлена ✅";

  } catch (e) {
    console.log(e);
    status.textContent = "Отменено или ошибка ❌";
  }
};

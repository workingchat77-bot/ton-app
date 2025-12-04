const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
  manifestUrl: "https://workingchat77-bot.github.io/ton-app/tonconnect-manifest.json"
});

tonConnectUI.renderWalletButton("#ton-connect-button");

tonConnectUI.onStatusChange(async (walletInfo) => {
  const addrEl = document.getElementById("wallet-address");
  const balEl = document.getElementById("wallet-balance");

  if (!walletInfo) {
    addrEl.textContent = "Кошелёк не подключен";
    balEl.textContent = "";
    return;
  }

  const address = walletInfo.account.address;
  addrEl.textContent = "Адрес: " + address;

  try {
    const res = await fetch(`https://toncenter.com/api/v2/getAddressInformation?address=${address}`);
    const data = await res.json();

    if (data.result && data.result.balance) {
      const ton = data.result.balance / 1e9;
      balEl.textContent = "Баланс: " + ton.toFixed(3) + " TON";
    }

  } catch (e) {
    balEl.textContent = "Баланс: ошибка";
  }
});

// ОПЛАТА
document.getElementById("pay-btn").onclick = async () => {
  const amountStr = document.getElementById("pay-amount").value;
  const toAddress = document.getElementById("pay-to").value.trim();
  const status = document.getElementById("pay-status");

  status.textContent = "";

  if (!tonConnectUI.account) {
    status.textContent = "Сначала подключи кошелёк";
    return;
  }

  if (!amountStr || Number(amountStr) <= 0) {
    status.textContent = "Укажи сумму";
    return;
  }

  if (!toAddress) {
    status.textContent = "Укажи адрес получателя";
    return;
  }

  try {
    status.textContent = "Ожидаем подтверждение в Tonkeeper...";

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

    status.textContent = "✅ Транзакция отправлена";

  } catch (e) {
    console.log(e);
    status.textContent = "❌ Отменено или ошибка";
  }
};

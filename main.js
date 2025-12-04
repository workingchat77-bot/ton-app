const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
  manifestUrl: "https://workingchat77-bot.github.io/ton-app/tonconnect-manifest.json"
});

// Рисуем кнопку подключения кошелька
tonConnectUI.renderWalletButton("#ton-connect-button");

// Отображение подключенного кошелька
tonConnectUI.onStatusChange((walletInfo) => {
  const el = document.getElementById("wallet-address");

  if (!walletInfo) {
    el.textContent = "Кошелёк не подключен";
    return;
  }

  el.textContent = "Подключен кошелёк: " + walletInfo.account.address;
});

// ТЕСТОВАЯ ОПЛАТА
document.getElementById("pay-btn").onclick = async () => {
  const amount = document.getElementById("pay-amount").value;
  const status = document.getElementById("pay-status");

  if (!amount || Number(amount) <= 0) {
    status.textContent = "Введите сумму";
    return;
  }

  try {
    status.textContent = "Ожидаем подтверждение в кошельке...";

    await tonConnectUI.sendTransaction({
      validUntil: Math.floor(Date.now() / 1000) + 300,
      messages: [
        {
          address: "UQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJKZ", 
          amount: (Number(amount) * 1e9).toString()
        }
      ]
    });

    status.textContent = "Транзакция отправлена ✅";

  } catch (e) {
    console.log(e);
    status.textContent = "Отмена или ошибка ❌";
  }
};

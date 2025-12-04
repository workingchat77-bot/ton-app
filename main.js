const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
  manifestUrl: "https://workingchat77-bot.github.io/ton-app/tonconnect-manifest.json"
});

const connectBtn = document.getElementById("ton-connect-button");
const walletAddress = document.getElementById("wallet-address");
const walletBalance = document.getElementById("wallet-balance");
const payBtn = document.getElementById("pay-btn");

async function connectWallet() {
  await tonConnectUI.connectWallet();
}

connectBtn.addEventListener("click", connectWallet);

tonConnectUI.onStatusChange(async wallet => {
  if (!wallet) {
    walletAddress.innerText = "Кошелёк не подключен";
    walletBalance.innerText = "";
    return;
  }

  const address = wallet.account.address;
  walletAddress.innerText = "Адрес: " + address;

  try {
    const res = await fetch(`https://tonapi.io/v2/accounts/${address}`);
    const data = await res.json();
    const balanceTon = (data.balance / 1e9).toFixed(4);
    walletBalance.innerText = Баланс: ${balanceTon} TON;
  } catch (e) {
    walletBalance.innerText = "Не удалось получить баланс";
  }
});

// ====== ОПЛАТА ======
payBtn.addEventListener("click", async () => {
  const amount = document.getElementById("pay-amount").value;
  const to = document.getElementById("pay-to").value;
  const status = document.getElementById("pay-status");

  if (!amount || !to) {
    status.innerText = "Введите сумму и адрес";
    return;
  }

  const nano = Math.floor(parseFloat(amount) * 1e9);

  try {
    await tonConnectUI.sendTransaction({
      validUntil: Math.floor(Date.now() / 1000) + 300,
      messages: [
        {
          address: to,
          amount: nano.toString()
        }
      ]
    });

    status.innerText = "✅ Транзакция отправлена в Tonkeeper";
  } catch (e) {
    status.innerText = "❌ Отмена или ошибка";
  }
});

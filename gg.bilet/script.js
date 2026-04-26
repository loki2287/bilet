const STORAGE_KEYS = {
  accounts: "ggbilet_accounts",
  session: "ggbilet_session",
  withdrawRequests: "ggbilet_withdraw_requests"
};

const ASSETS = {
  bronzeCase: "Снимок экрана 2026-04-26 202316.png",
  carbonCase: "Снимок экрана 2026-04-26 202335.png",
  goldCase: "Снимок экрана 2026-04-26 202347.png",
  ticket: "Free-Design-Lottery-Ticket-Scratch-off-Tickets-Printing-Lottery-Scratch-Cards-Lottery-Games-Tickets-Win-Card.avif",
  trophy: "png-clipart-trophy-cup-gold-cup-with-laurel-leaves-gold-trophy-medal-gold-thumbnail.png"
};

const CASES = [
  {
    id: "bronze",
    name: "Бронза",
    subtitle: "билетная серия",
    price: 50,
    image: ASSETS.bronzeCase,
    drops: [
      { id: "ticket-micro", name: "Micro билет", image: ASSETS.ticket, tickets: 5, weight: 16 },
      { id: "ticket-start", name: "Стартовый билет", image: ASSETS.ticket, tickets: 20, weight: 12 },
      { id: "ticket-double", name: "Двойной билет", image: ASSETS.ticket, tickets: 35, weight: 9 },
      { id: "ticket-stable", name: "Стабильный билет", image: ASSETS.ticket, tickets: 50, weight: 6 },
      { id: "ticket-lucky", name: "Лаки билет", image: ASSETS.ticket, tickets: 70, weight: 4 },
      { id: "ticket-shine", name: "Шайн билет", image: ASSETS.ticket, tickets: 110, weight: 1.5 }
    ]
  },
  {
    id: "carbon",
    name: "Карбон",
    subtitle: "прокачанные билеты",
    price: 150,
    image: ASSETS.carbonCase,
    drops: [
      { id: "ticket-micro-carbon", name: "Micro билет", image: ASSETS.ticket, tickets: 10, weight: 16 },
      { id: "ticket-power", name: "Power билет", image: ASSETS.ticket, tickets: 70, weight: 12 },
      { id: "ticket-stack", name: "Stack билет", image: ASSETS.ticket, tickets: 110, weight: 8 },
      { id: "ticket-carbon", name: "Carbon билет", image: ASSETS.ticket, tickets: 150, weight: 5 },
      { id: "ticket-flash", name: "Flash билет", image: ASSETS.ticket, tickets: 210, weight: 3.5 },
      { id: "ticket-boost", name: "Boost билет", image: ASSETS.ticket, tickets: 330, weight: 1.2 }
    ]
  },
  {
    id: "royal",
    name: "Роял",
    subtitle: "дорогая серия",
    price: 350,
    image: ASSETS.goldCase,
    drops: [
      { id: "ticket-micro-royal", name: "Micro билет", image: ASSETS.ticket, tickets: 15, weight: 16 },
      { id: "ticket-royal", name: "Royal билет", image: ASSETS.ticket, tickets: 130, weight: 11 },
      { id: "ticket-premium", name: "Premium билет", image: ASSETS.ticket, tickets: 220, weight: 7 },
      { id: "ticket-elite", name: "Elite билет", image: ASSETS.ticket, tickets: 350, weight: 4.5 },
      { id: "ticket-diamond", name: "Diamond билет", image: ASSETS.ticket, tickets: 520, weight: 2.5 },
      { id: "ticket-imperial", name: "Imperial билет", image: ASSETS.ticket, tickets: 900, weight: 1.1 },
      { id: "cup-legend", name: "Легендарный кубок", image: ASSETS.trophy, tickets: 2500, chancePercent: 0.4, label: "0.4%" }
    ]
  }
];

const UPGRADE_MULTIPLIERS = [1.5, 2, 3, 5, 7, 10];
const MIN_UPGRADE_BET = 25;

const state = {
  mode: "login",
  view: "cases",
  selectedCaseId: null,
  selectedUpgradeMultiplier: 2,
  upgradeBet: MIN_UPGRADE_BET,
  currentUser: null,
  spinning: false,
  upgrading: false,
  adminPanelOpen: false,
  messagesOpen: false,
  upgradeRotation: 0
};

const authScreen = document.getElementById("auth-screen");
const gameScreen = document.getElementById("game-screen");
const authForm = document.getElementById("auth-form");
const banOverlay = document.getElementById("ban-overlay");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const confirmGroup = document.getElementById("confirm-group");
const confirmPasswordInput = document.getElementById("confirm-password");
const authSubmit = document.getElementById("auth-submit");
const authStatus = document.getElementById("auth-status");
const tabLogin = document.getElementById("tab-login");
const tabRegister = document.getElementById("tab-register");
const panelTitle = document.getElementById("panel-title");

const adminButton = document.getElementById("admin-button");
const adminPanel = document.getElementById("admin-panel");
const adminCloseButton = document.getElementById("admin-close-button");
const adminAccounts = document.getElementById("admin-accounts");

const avatarPreview = document.getElementById("avatar-preview");
const avatarInput = document.getElementById("avatar-input");
const welcomeName = document.getElementById("welcome-name");
const profileNote = document.getElementById("profile-note");
const logoutButton = document.getElementById("logout-button");
const casesNavButton = document.getElementById("cases-nav-button");
const upgraderNavButton = document.getElementById("upgrader-nav-button");
const ticketBalance = document.getElementById("ticket-balance");
const bestRound = document.getElementById("best-round");
const messagesButton = document.getElementById("messages-button");
const tradeStatus = document.getElementById("trade-status");
const tradeLinkInput = document.getElementById("trade-link-input");
const saveTradeLinkButton = document.getElementById("save-trade-link-button");
const withdrawAmountInput = document.getElementById("withdraw-amount-input");
const withdrawButton = document.getElementById("withdraw-button");
const messagesPanel = document.getElementById("messages-panel");
const messagesCloseButton = document.getElementById("messages-close-button");
const messagesList = document.getElementById("messages-list");

const casesZone = document.getElementById("cases-zone");
const caseGrid = document.getElementById("case-grid");
const selectionCount = document.getElementById("selection-count");
const battleZone = document.getElementById("battle-zone");
const spinButton = document.getElementById("spin-button");
const roundTotal = document.getElementById("round-total");
const roundMessage = document.getElementById("round-message");
const selectedCaseThumb = document.getElementById("selected-case-thumb");
const selectedCaseName = document.getElementById("selected-case-name");
const selectedCasePrice = document.getElementById("selected-case-price");
const reelTrack = document.getElementById("reel-track");
const reelWindow = document.querySelector(".reel-window");
const dropPreviewImage = document.getElementById("drop-preview-image");
const dropPreviewValue = document.getElementById("drop-preview-value");
const dropPreviewName = document.getElementById("drop-preview-name");

const upgraderZone = document.getElementById("upgrader-zone");
const upgraderStatus = document.getElementById("upgrader-status");
const upgradeBetRange = document.getElementById("upgrade-bet-range");
const upgradeBetInput = document.getElementById("upgrade-bet-input");
const upgradeMultipliers = document.getElementById("upgrade-multipliers");
const upgradeWheelDisc = document.getElementById("upgrade-wheel-disc");
const upgradeWheelFace = document.getElementById("upgrade-wheel-face");
const upgradeChance = document.getElementById("upgrade-chance");
const upgradeChanceCopy = document.getElementById("upgrade-chance-copy");
const upgradeTargetLabel = document.getElementById("upgrade-target-label");
const upgradeButton = document.getElementById("upgrade-button");
const upgradeSourceImage = document.getElementById("upgrade-source-image");
const upgradeSourceName = document.getElementById("upgrade-source-name");
const upgradeSourceValue = document.getElementById("upgrade-source-value");
const upgradeTargetImage = document.getElementById("upgrade-target-image");
const upgradeTargetName = document.getElementById("upgrade-target-name");
const upgradeTargetValue = document.getElementById("upgrade-target-value");
const upgradePayoutValue = document.getElementById("upgrade-payout-value");
const upgradeLastResult = document.getElementById("upgrade-last-result");

function getAccounts() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.accounts)) || {};
  } catch {
    return {};
  }
}

function saveAccounts(accounts) {
  localStorage.setItem(STORAGE_KEYS.accounts, JSON.stringify(accounts));
}

function loadUser(username) {
  const accounts = getAccounts();
  return accounts[username] || null;
}

function saveUser(username, userData) {
  const accounts = getAccounts();
  accounts[username] = userData;
  saveAccounts(accounts);
}

function getSession() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.session));
  } catch {
    return null;
  }
}

function saveSession(session) {
  localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(session));
}

function clearSession() {
  localStorage.removeItem(STORAGE_KEYS.session);
}

function getWithdrawRequests() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.withdrawRequests)) || [];
  } catch {
    return [];
  }
}

function saveWithdrawRequests(requests) {
  localStorage.setItem(STORAGE_KEYS.withdrawRequests, JSON.stringify(requests));
}

function sanitizeUsername(value) {
  return value.trim().toLowerCase();
}

function createSalt() {
  if (globalThis.crypto?.randomUUID) {
    return crypto.randomUUID().replaceAll("-", "");
  }

  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function fallbackHash(input) {
  let hash = 2166136261;

  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return (hash >>> 0).toString(16).padStart(8, "0");
}

async function hashPassword(password, salt) {
  const raw = `${salt}:${password}`;

  if (globalThis.crypto?.subtle) {
    const data = new TextEncoder().encode(raw);
    const digest = await crypto.subtle.digest("SHA-256", data);
    return [...new Uint8Array(digest)].map((item) => item.toString(16).padStart(2, "0")).join("");
  }

  return fallbackHash(raw);
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function normalizeAngle(angle) {
  return ((angle % 360) + 360) % 360;
}

function getCircularDistance(first, second) {
  const diff = Math.abs(normalizeAngle(first) - normalizeAngle(second));
  return Math.min(diff, 360 - diff);
}

function formatTickets(value) {
  return `${Math.round(value)} билетов`;
}

function formatMultiplier(value) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function formatDateTime(value) {
  return new Date(value).toLocaleString("ru-RU");
}

function normalizeTradeLink(value) {
  return value.trim();
}

function isAdminUser(username) {
  return username === "petrushka228";
}

function isBannedAccount(accountLike) {
  return Boolean(accountLike?.banned);
}

function buildCodexAvatar(seed = "codex") {
  const safeSeed = encodeURIComponent(seed.slice(0, 10).toUpperCase());
  return `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='%23ffbf40'/><stop offset='1' stop-color='%23d17810'/></linearGradient></defs><rect width='200' height='200' rx='38' fill='%23131c27'/><rect x='14' y='14' width='172' height='172' rx='30' fill='url(%23g)' opacity='0.16'/><text x='50%25' y='46%25' text-anchor='middle' dominant-baseline='middle' font-family='Arial' font-size='54' font-weight='700' fill='%23f7f2e6'>CX</text><text x='50%25' y='72%25' text-anchor='middle' font-family='Arial' font-size='18' font-weight='700' fill='%23f7f2e6'>${safeSeed}</text></svg>`;
}

function getCaseNormalDrops(caseItem) {
  return caseItem.drops.filter((drop) => !drop.chancePercent);
}

function getCaseProfitChance(caseItem) {
  const specialDrops = caseItem.drops.filter((drop) => typeof drop.chancePercent === "number");
  const normalDrops = getCaseNormalDrops(caseItem);
  const specialChance = specialDrops.reduce((sum, drop) => sum + drop.chancePercent, 0);
  const normalWeightTotal = normalDrops.reduce((sum, drop) => sum + (drop.weight || 1), 0);
  let profitChance = 0;

  normalDrops.forEach((drop) => {
    if (drop.tickets >= caseItem.price) {
      profitChance += ((drop.weight || 1) / normalWeightTotal) * Math.max(0, 100 - specialChance);
    }
  });

  specialDrops.forEach((drop) => {
    if (drop.tickets >= caseItem.price) {
      profitChance += drop.chancePercent;
    }
  });

  return profitChance;
}

function getDropById(caseItem, dropId) {
  return caseItem.drops.find((drop) => drop.id === dropId) || null;
}

function getSelectedCase() {
  return CASES.find((caseItem) => caseItem.id === state.selectedCaseId) || null;
}

function getCurrentLuckMultiplier() {
  return clamp(state.currentUser?.luckMultiplier ?? 1, 0.25, 3);
}

function getCurrentBalance() {
  return state.currentUser?.tickets ?? 0;
}

function canAffordCase(caseItem) {
  return Boolean(caseItem) && getCurrentBalance() >= caseItem.price;
}

function canAffordUpgrade() {
  return getCurrentBalance() >= MIN_UPGRADE_BET;
}

function refreshCurrentUserFromStore() {
  if (!state.currentUser) {
    return;
  }

  const fresh = loadUser(state.currentUser.username);
  state.currentUser = fresh ? { username: state.currentUser.username, ...fresh } : null;
}

function getUserAvatarSrc(username, account) {
  return account?.avatarDataUrl || buildCodexAvatar(username || "CODEX");
}

function updateStoredUser(patch) {
  if (!state.currentUser) {
    return;
  }

  const nextData = {
    ...loadUser(state.currentUser.username),
    ...patch
  };

  saveUser(state.currentUser.username, nextData);
  state.currentUser = {
    username: state.currentUser.username,
    ...nextData
  };
}

function markCurrentUserSeen() {
  if (!state.currentUser) {
    return;
  }

  updateStoredUser({
    lastSeenAt: new Date().toISOString()
  });
}

function setMode(mode) {
  state.mode = mode;
  const isRegister = mode === "register";

  tabLogin.classList.toggle("active", !isRegister);
  tabRegister.classList.toggle("active", isRegister);
  confirmGroup.classList.toggle("hidden", !isRegister);
  confirmPasswordInput.required = isRegister;
  passwordInput.autocomplete = isRegister ? "new-password" : "current-password";
  authSubmit.textContent = isRegister ? "Создать аккаунт" : "Войти";
  panelTitle.textContent = isRegister ? "Регистрация аккаунта" : "Вход и регистрация";
  authStatus.textContent = isRegister
    ? "Создай новый аккаунт: логин будет уникальным, а пароль сохранится в защищенном виде."
    : "Войди в свой аккаунт, чтобы открыть кейс или зайти в апгрейд.";
  authStatus.className = "status-text";
}

function setStatus(message, type = "neutral") {
  authStatus.textContent = message;
  authStatus.className = "status-text";

  if (type === "error") {
    authStatus.classList.add("error");
  }

  if (type === "success") {
    authStatus.classList.add("success");
  }
}

function setView(view) {
  state.view = view;
  const casesMode = view === "cases";

  casesZone.classList.toggle("hidden", !casesMode);
  battleZone.classList.toggle("hidden", !casesMode);
  upgraderZone.classList.toggle("hidden", casesMode);
  casesNavButton.classList.toggle("active", casesMode);
  upgraderNavButton.classList.toggle("active", !casesMode);
}

function renderAdminPanel() {
  const isAdmin = isAdminUser(state.currentUser?.username);
  adminButton.classList.toggle("hidden", !isAdmin);
  adminPanel.classList.toggle("hidden", !isAdmin || !state.adminPanelOpen);

  if (!isAdmin || !state.adminPanelOpen) {
    return;
  }

  const accounts = getAccounts();
  const session = getSession();
  const accountEntries = Object.entries(accounts);

  adminAccounts.innerHTML = accountEntries.map(([username, account]) => {
    const luck = clamp(account.luckMultiplier ?? 1, 0.25, 3);
    const isOnline = session?.username === username;
    const isBanned = isBannedAccount(account);
    const seenLabel = account.lastSeenAt
      ? new Date(account.lastSeenAt).toLocaleString("ru-RU")
      : "нет активности";
    const statusLabel = isBanned ? "забанен" : "не забанен";
    const banStatusClass = isBanned ? "admin-danger" : "admin-safe";
    const onlineStatusClass = isOnline ? "admin-safe" : "admin-danger";

    return `
      <article class="admin-account-card">
        <div class="admin-account-head">
          <div class="admin-account-avatar">
            <img src="${getUserAvatarSrc(username, account)}" alt="${username}">
          </div>
          <div class="admin-account-meta">
            <strong>${username}</strong>
            <span class="admin-account-status ${banStatusClass}">статус: ${statusLabel}</span>
            <span class="${onlineStatusClass}">${isOnline ? "онлайн" : `офлайн • ${seenLabel}`}</span>
          </div>
        </div>
        <div class="admin-account-stats">
          <strong>Билеты: ${account.tickets ?? 0}</strong>
          <span>Удача: x${luck.toFixed(2)}</span>
          <span>Прокрутов: ${account.totalSpins ?? 0}</span>
          <span>Потрачено: ${account.totalSpent ?? 0}</span>
        </div>
        <div class="admin-account-actions">
          <button class="mini-button" data-action="tickets-add" data-username="${username}" data-value="50">+50 билетов</button>
          <button class="mini-button" data-action="tickets-add" data-username="${username}" data-value="100">+100 билетов</button>
          <button class="mini-button" data-action="tickets-sub" data-username="${username}" data-value="50">-50 билетов</button>
          <button class="mini-button" data-action="tickets-sub" data-username="${username}" data-value="100">-100 билетов</button>
          <button class="mini-button" data-action="luck-add" data-username="${username}" data-value="0.1">+ удача</button>
          <button class="mini-button" data-action="luck-sub" data-username="${username}" data-value="0.1">- удача</button>
          <button class="mini-button" data-action="luck-reset" data-username="${username}">сброс удачи</button>
          <button class="mini-button" data-action="ban" data-username="${username}" ${username === "petrushka228" ? "disabled" : ""}>бан</button>
          <button class="mini-button" data-action="unban" data-username="${username}">разбан</button>
        </div>
      </article>
    `;
  }).join("");
}

function renderMessagesPanel() {
  const isAdmin = isAdminUser(state.currentUser?.username);
  const requests = getWithdrawRequests();
  const activeRequests = requests.filter((request) => request.status !== "closed");

  messagesButton.classList.toggle("hidden", !isAdmin);
  messagesButton.textContent = activeRequests.length ? `Сообщения (${activeRequests.length})` : "Сообщения";
  messagesPanel.classList.toggle("hidden", !isAdmin || !state.messagesOpen);

  if (!isAdmin || !state.messagesOpen) {
    return;
  }

  if (!requests.length) {
    messagesList.innerHTML = `<div class="message-empty">Пока нет ни одной заявки на вывод.</div>`;
    return;
  }

  messagesList.innerHTML = requests.map((request) => `
    <article class="message-card">
      <div>
        <strong>${request.username}</strong>
        <span>Запросил вывод: ${request.amount} билетов</span>
        <span>Когда: ${formatDateTime(request.createdAt)}</span>
      </div>
      <div>
        <span>Trade ссылка:</span>
        <a href="${request.tradeLink}" target="_blank" rel="noreferrer">${request.tradeLink}</a>
      </div>
      <div class="message-actions">
        <button class="mini-button" data-request-action="done" data-request-id="${request.id}">Выполнено</button>
        <button class="mini-button" data-request-action="remove" data-request-id="${request.id}">Удалить</button>
      </div>
    </article>
  `).join("");
}

function updateTradeUi() {
  const tradeLink = state.currentUser?.tradeLink ?? "";
  tradeLinkInput.value = tradeLink;
  withdrawAmountInput.value = "";

  if (isBannedAccount(state.currentUser)) {
    tradeStatus.textContent = "Аккаунт забанен. Заявки на вывод недоступны.";
    withdrawButton.disabled = true;
    saveTradeLinkButton.disabled = true;
    return;
  }

  tradeStatus.textContent = tradeLink
    ? "Trade ссылка сохранена. Можно отправлять заявку на вывод."
    : "Сначала сохрани свою trade ссылку, потом отправляй заявку.";
  withdrawButton.disabled = false;
  saveTradeLinkButton.disabled = false;
}

function renderCaseGrid() {
  const template = document.getElementById("case-card-template");
  caseGrid.innerHTML = "";

  CASES.forEach((caseItem) => {
    const fragment = template.content.cloneNode(true);
    const button = fragment.querySelector(".case-card");
    const image = fragment.querySelector(".case-image");
    const name = fragment.querySelector(".case-name");
    const subtitle = fragment.querySelector(".case-subtitle");
    const profitTag = fragment.querySelector(".case-profit-tag");
    const rangeTag = fragment.querySelector(".case-range-tag");
    const price = fragment.querySelector(".case-price");

    button.dataset.caseId = caseItem.id;
    button.classList.toggle("selected", state.selectedCaseId === caseItem.id);
    image.src = caseItem.image;
    image.alt = caseItem.name;
    name.textContent = caseItem.name;
    subtitle.textContent = `${caseItem.subtitle} • ${caseItem.drops.length} предметов`;
    profitTag.textContent = `Окуп: ${getCaseProfitChance(caseItem).toFixed(1)}%`;
    rangeTag.textContent = `Низ: ${Math.min(...caseItem.drops.map((drop) => drop.tickets))} билетов`;
    price.textContent = `${caseItem.price} билетов`;
    button.addEventListener("click", () => selectCase(caseItem.id));
    caseGrid.appendChild(fragment);
  });
}

function buildReelMarkup(sequence) {
  return sequence.map((drop) => `
    <div class="reel-item" data-drop-id="${drop.id}">
      <img class="reel-item-image" src="${drop.image}" alt="${drop.name}">
      <div class="reel-item-copy">
        <strong>${drop.name}</strong>
        <span>${drop.tickets} билетов${drop.label ? ` • ${drop.label}` : ""}</span>
      </div>
    </div>
  `).join("");
}

function renderIdleReel(caseItem) {
  const baseDrops = getCaseNormalDrops(caseItem);
  const idleSequence = [...baseDrops, ...baseDrops, ...baseDrops, ...baseDrops];
  reelTrack.innerHTML = buildReelMarkup(idleSequence);
  delete reelTrack.dataset.locked;
  reelTrack.style.transition = "none";
  reelTrack.style.transform = "translateX(-80px)";
}

function updateSelectionUi() {
  const selectedCase = getSelectedCase();
  const blocked = isBannedAccount(state.currentUser);
  selectionCount.textContent = selectedCase ? selectedCase.name : "Не выбран";
  spinButton.disabled = !selectedCase || state.spinning || state.upgrading || !canAffordCase(selectedCase) || blocked;

  if (!selectedCase) {
    selectedCaseThumb.removeAttribute("src");
    selectedCaseThumb.alt = "";
    selectedCaseName.textContent = "Сначала выбери кейс";
    selectedCasePrice.textContent = "0 билетов";
    reelTrack.innerHTML = "";
    dropPreviewImage.removeAttribute("src");
    dropPreviewImage.alt = "";
    dropPreviewValue.textContent = "?";
    dropPreviewName.textContent = "Ждёт открытия";
    return;
  }

  selectedCaseThumb.src = selectedCase.image;
  selectedCaseThumb.alt = selectedCase.name;
  selectedCaseName.textContent = selectedCase.name;
  selectedCasePrice.textContent = canAffordCase(selectedCase)
    ? `${selectedCase.price} билетов`
    : `${selectedCase.price} билетов • не хватает`;

  if (!state.spinning && !reelTrack.dataset.locked) {
    renderIdleReel(selectedCase);
    dropPreviewImage.src = ASSETS.ticket;
    dropPreviewImage.alt = "Билет";
    dropPreviewValue.textContent = "Готов";
    dropPreviewName.textContent = blocked
      ? "Аккаунт забанен, прокрут недоступен"
      : canAffordCase(selectedCase)
        ? "Открытие ждёт запуска"
        : "Недостаточно билетов для открытия";
  }
}

function selectCase(caseId) {
  if (state.spinning || state.upgrading) {
    return;
  }

  state.selectedCaseId = caseId;
  delete reelTrack.dataset.locked;
  renderCaseGrid();
  updateSelectionUi();
  roundMessage.textContent = canAffordCase(getSelectedCase())
    ? "Кейс выбран. Жми открыть и смотри красивый прокрут."
    : "На аккаунте пока 0 или мало билетов. Сначала начисли их через админку.";
}

function buildWeightedBag(dropPool) {
  const bag = [];
  const luck = getCurrentLuckMultiplier();

  dropPool.forEach((drop, index) => {
    const baseWeight = Math.max(1, Number(drop.weight || 1));
    const normalizedIndex = dropPool.length <= 1 ? 0 : index / (dropPool.length - 1);
    const swing = normalizedIndex * 6 - 3;
    const adjustedWeight = Math.max(1, Math.round(baseWeight * Math.pow(luck, swing) * 10));

    for (let repeat = 0; repeat < adjustedWeight; repeat += 1) {
      bag.push(drop);
    }
  });

  return bag;
}

function pickRandomDrop(dropPool) {
  const specialDrop = dropPool.find((drop) => typeof drop.chancePercent === "number");
  const luck = getCurrentLuckMultiplier();

  if (specialDrop && Math.random() * 100 < Math.min(15, specialDrop.chancePercent * Math.pow(luck, 3))) {
    return specialDrop;
  }

  const normalDrops = getCaseNormalDrops({ drops: dropPool });
  const bag = buildWeightedBag(normalDrops);
  return bag[Math.floor(Math.random() * bag.length)];
}

function buildReelSequence(dropPool, targetDrop) {
  const normalDrops = getCaseNormalDrops({ drops: dropPool });
  const sequence = [];
  const totalItems = 220;
  const targetIndex = 154;
  const startIndex = 20;

  for (let index = 0; index < totalItems; index += 1) {
    sequence.push(normalDrops[Math.floor(Math.random() * normalDrops.length)]);
  }

  sequence[targetIndex] = targetDrop;

  return {
    sequence,
    startIndex,
    targetIndex
  };
}

function getCenteredReelItem() {
  const items = [...reelTrack.querySelectorAll(".reel-item")];
  const markerCenter = reelWindow.getBoundingClientRect().left + reelWindow.clientWidth / 2;
  let result = null;
  let minDistance = Number.POSITIVE_INFINITY;

  items.forEach((item) => {
    const rect = item.getBoundingClientRect();
    const center = rect.left + rect.width / 2;
    const distance = Math.abs(center - markerCenter);

    if (distance < minDistance) {
      minDistance = distance;
      result = item;
    }
  });

  return result;
}

function getCenteredOffsetForItem(item) {
  return Math.max(0, item.offsetLeft - (reelWindow.clientWidth - item.offsetWidth) / 2);
}

function wait(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function getUpgradeSourceDescriptor(bet) {
  if (bet >= 350) {
    return {
      name: "Royal вклад",
      image: ASSETS.goldCase,
      subtitle: `${bet} билетов`
    };
  }

  if (bet >= 150) {
    return {
      name: "Carbon вклад",
      image: ASSETS.carbonCase,
      subtitle: `${bet} билетов`
    };
  }

  if (bet >= 50) {
    return {
      name: "Bronze вклад",
      image: ASSETS.bronzeCase,
      subtitle: `${bet} билетов`
    };
  }

  return {
    name: "Ticket stack",
    image: ASSETS.ticket,
    subtitle: `${bet} билетов`
  };
}

function getUpgradeTargetDescriptor(multiplier, payout) {
  if (multiplier >= 10) {
    return {
      name: "Jackpot Cup",
      image: ASSETS.trophy,
      subtitle: `${payout} билетов`
    };
  }

  if (multiplier >= 7) {
    return {
      name: "Royal Burst",
      image: ASSETS.goldCase,
      subtitle: `${payout} билетов`
    };
  }

  if (multiplier >= 5) {
    return {
      name: "Carbon Surge",
      image: ASSETS.carbonCase,
      subtitle: `${payout} билетов`
    };
  }

  if (multiplier >= 3) {
    return {
      name: "Bronze Boost",
      image: ASSETS.bronzeCase,
      subtitle: `${payout} билетов`
    };
  }

  return {
    name: "Double Ticket",
    image: ASSETS.ticket,
    subtitle: `${payout} билетов`
  };
}

function normalizeUpgradeBet(value) {
  const balance = getCurrentBalance();
  let nextValue = Number(value);

  if (!Number.isFinite(nextValue)) {
    nextValue = state.upgradeBet;
  }

  nextValue = Math.round(nextValue / 5) * 5;
  nextValue = Math.max(MIN_UPGRADE_BET, nextValue);

  if (balance >= MIN_UPGRADE_BET) {
    const maxBet = Math.max(MIN_UPGRADE_BET, Math.floor(balance / 5) * 5);
    nextValue = clamp(nextValue, MIN_UPGRADE_BET, maxBet);
  }

  return nextValue;
}

function getUpgradeBaseChance(multiplier) {
  return clamp(100 / multiplier, 1.5, 96);
}

function getUpgradeEffectiveChance(multiplier) {
  const baseChance = getUpgradeBaseChance(multiplier);
  const luck = getCurrentLuckMultiplier();
  const effectiveChance = baseChance + (100 - baseChance) * ((luck - 1) * 0.08);
  return clamp(effectiveChance, 1.5, 96);
}

function getUpgradeSuccessArc(chancePercent) {
  const span = clamp(chancePercent * 3.6, 5.4, 345.6);
  const start = normalizeAngle(180 - span / 2);
  const end = normalizeAngle(180 + span / 2);
  return {
    span,
    start,
    end
  };
}

function isUpgradeSuccessAngle(localAngle, chancePercent) {
  const safeAngle = normalizeAngle(localAngle);
  const { start, end } = getUpgradeSuccessArc(chancePercent);

  if (start <= end) {
    return safeAngle >= start && safeAngle <= end;
  }

  return safeAngle >= start || safeAngle <= end;
}

function getUpgradePointerAngleFromRotation(rotation) {
  return normalizeAngle(180 - normalizeAngle(rotation));
}

function getRenderedWheelRotation() {
  const transform = window.getComputedStyle(upgradeWheelDisc).transform;

  if (!transform || transform === "none") {
    return normalizeAngle(state.upgradeRotation);
  }

  const matrixMatch = transform.match(/matrix\(([^)]+)\)/);

  if (matrixMatch) {
    const [a, b] = matrixMatch[1].split(",").map((value) => Number(value.trim()));
    return normalizeAngle((Math.atan2(b, a) * 180) / Math.PI);
  }

  const matrix3dMatch = transform.match(/matrix3d\(([^)]+)\)/);

  if (matrix3dMatch) {
    const values = matrix3dMatch[1].split(",").map((value) => Number(value.trim()));
    return normalizeAngle((Math.atan2(values[1], values[0]) * 180) / Math.PI);
  }

  return normalizeAngle(state.upgradeRotation);
}

function getUpgradeChanceCopy(chance, multiplier) {
  return `Базовый шанс по формуле апгрейда: x${formatMultiplier(multiplier)} = ${chance.toFixed(2)}%.`;
}

function renderUpgrader() {
  const balance = getCurrentBalance();
  const canPlay = balance >= MIN_UPGRADE_BET && !isBannedAccount(state.currentUser);
  const multiplier = state.selectedUpgradeMultiplier;
  const bet = balance >= MIN_UPGRADE_BET ? normalizeUpgradeBet(state.upgradeBet) : MIN_UPGRADE_BET;
  const payout = Math.round(bet * multiplier);
  const chance = getUpgradeBaseChance(multiplier);
  const source = getUpgradeSourceDescriptor(bet);
  const target = getUpgradeTargetDescriptor(multiplier, payout);
  const maxRange = balance >= MIN_UPGRADE_BET ? Math.max(MIN_UPGRADE_BET, Math.floor(balance / 5) * 5) : MIN_UPGRADE_BET;
  const successArc = getUpgradeSuccessArc(chance);

  state.upgradeBet = bet;
  upgradeBetRange.min = String(MIN_UPGRADE_BET);
  upgradeBetRange.max = String(maxRange);
  upgradeBetRange.value = String(bet);
  upgradeBetRange.disabled = !canPlay || state.upgrading || state.spinning;

  upgradeBetInput.min = String(MIN_UPGRADE_BET);
  upgradeBetInput.value = String(bet);
  upgradeBetInput.disabled = !canPlay || state.upgrading || state.spinning;

  upgradeSourceImage.src = source.image;
  upgradeSourceImage.alt = source.name;
  upgradeSourceName.textContent = source.name;
  upgradeSourceValue.textContent = source.subtitle;

  upgradeTargetImage.src = target.image;
  upgradeTargetImage.alt = target.name;
  upgradeTargetName.textContent = target.name;
  upgradeTargetValue.textContent = target.subtitle;
  upgradePayoutValue.textContent = String(payout);

  upgradeChance.textContent = `${chance.toFixed(2)}%`;
  upgradeTargetLabel.textContent = `x${formatMultiplier(multiplier)}`;
  upgradeChanceCopy.textContent = getUpgradeChanceCopy(chance, multiplier);
  upgradeButton.textContent = `Апнуть на x${formatMultiplier(multiplier)}`;
  upgradeButton.disabled = !canPlay || state.upgrading || state.spinning;

  if (isBannedAccount(state.currentUser)) {
    upgraderStatus.textContent = "Аккаунт забанен. Апгрейд заблокирован.";
  } else if (balance < MIN_UPGRADE_BET) {
    upgraderStatus.textContent = "Нужно минимум 25 билетов, чтобы зайти в апгрейд.";
  } else if (state.upgrading) {
    upgraderStatus.textContent = `Колесо крутится. Шанс для x${formatMultiplier(multiplier)} сейчас ${chance.toFixed(2)}%.`;
  } else {
    upgraderStatus.textContent = `Ставка ${bet} билетов. Цель x${formatMultiplier(multiplier)}. Шанс: ${chance.toFixed(2)}%.`;
  }

  upgradeWheelDisc.style.background = `
    conic-gradient(
      from -90deg,
      rgba(255, 120, 120, 0.98) 0deg ${successArc.start}deg,
      rgba(255, 222, 102, 1) ${successArc.start}deg ${successArc.end}deg,
      rgba(255, 120, 120, 0.98) ${successArc.end}deg 360deg
    )
  `;
  upgradeWheelDisc.style.transform = `rotate(${state.upgradeRotation}deg)`;

  [...upgradeMultipliers.querySelectorAll("[data-upgrade-multiplier]")].forEach((button) => {
    button.classList.toggle("active", Number(button.dataset.upgradeMultiplier) === multiplier);
    button.disabled = state.upgrading || state.spinning;
  });
}

function setCurrentUser(username) {
  const user = loadUser(username);
  state.currentUser = user ? { username, ...user } : null;
  renderUser();
}

function updateAvatarPreview() {
  const avatarSource = state.currentUser?.avatarDataUrl || buildCodexAvatar(state.currentUser?.username || "CODEX");
  avatarPreview.src = avatarSource;
  avatarPreview.alt = state.currentUser?.username ? `Аватар ${state.currentUser.username}` : "Аватар";
}

function renderUser() {
  const isLoggedIn = Boolean(state.currentUser);
  const isBanned = isBannedAccount(state.currentUser);

  authScreen.classList.toggle("hidden", isLoggedIn);
  gameScreen.classList.toggle("hidden", !isLoggedIn);
  logoutButton.classList.toggle("hidden", !isLoggedIn);
  banOverlay.classList.toggle("hidden", !isLoggedIn || !isBanned);

  if (!isLoggedIn) {
    renderAdminPanel();
    renderMessagesPanel();
    return;
  }

  welcomeName.textContent = `Привет, ${state.currentUser.username}`;
  profileNote.textContent = isBanned
    ? "Аккаунт заблокирован. Пока бан не снимут, действия на сайте недоступны."
    : "Новый аккаунт стартует с 0 билетов и не может открыть кейс или апгрейд, пока админ не начислит баланс.";
  ticketBalance.textContent = String(getCurrentBalance());
  bestRound.textContent = String(state.currentUser.bestRound ?? 0);
  updateAvatarPreview();
  markCurrentUserSeen();
  renderCaseGrid();
  updateSelectionUi();
  renderUpgrader();
  renderAdminPanel();
  updateTradeUi();
  renderMessagesPanel();
  setView(state.view);
}

async function handleRegister(username, password, confirmPassword) {
  const safeUsername = sanitizeUsername(username);
  const accounts = getAccounts();

  if (safeUsername.length < 3) {
    setStatus("Логин должен быть минимум 3 символа.", "error");
    return;
  }

  if (!/^[\p{L}\p{N}_-]+$/u.test(safeUsername)) {
    setStatus("Логин: буквы, цифры, _ или -", "error");
    return;
  }

  if (password.length < 6) {
    setStatus("Пароль должен быть минимум 6 символов.", "error");
    return;
  }

  if (password !== confirmPassword) {
    setStatus("Пароли не совпадают.", "error");
    return;
  }

  if (accounts[safeUsername]) {
    setStatus("Такой логин уже существует. Выбери другой.", "error");
    return;
  }

  const salt = createSalt();
  const passwordHash = await hashPassword(password, salt);

  accounts[safeUsername] = {
    salt,
    passwordHash,
    tickets: 0,
    bestRound: 0,
    luckMultiplier: 1,
    totalSpins: 0,
    totalSpent: 0,
    avatarDataUrl: "",
    tradeLink: "",
    lastSeenAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    banned: false
  };

  saveAccounts(accounts);
  saveSession({ username: safeUsername });
  authForm.reset();
  setMode("login");
  setCurrentUser(safeUsername);
  roundMessage.textContent = "Аккаунт создан. Сейчас на нём 0 билетов, открыть кейс и апгрейд нельзя, пока админ не начислит баланс.";
}

async function handleLogin(username, password) {
  const safeUsername = sanitizeUsername(username);
  const account = loadUser(safeUsername);

  if (!account) {
    setStatus("Аккаунт не найден. Сначала зарегистрируйся.", "error");
    return;
  }

  const passwordHash = await hashPassword(password, account.salt);

  if (passwordHash !== account.passwordHash) {
    setStatus("Неверный пароль. Без него войти нельзя.", "error");
    return;
  }

  saveSession({ username: safeUsername });
  authForm.reset();
  setCurrentUser(safeUsername);
  setStatus("Вход выполнен.", "success");
  roundMessage.textContent = "С возвращением. Если билетов нет, открытие кейса и апгрейд не запустятся.";
}

function applySpinEconomy(caseItem, earnedTickets) {
  if (!state.currentUser) {
    return 0;
  }

  const nextTickets = Math.max(0, getCurrentBalance() - caseItem.price + earnedTickets);
  const netResult = earnedTickets - caseItem.price;
  const nextBestRound = Math.max(state.currentUser.bestRound ?? 0, earnedTickets);

  updateStoredUser({
    tickets: nextTickets,
    bestRound: nextBestRound,
    totalSpins: (state.currentUser.totalSpins ?? 0) + 1,
    totalSpent: (state.currentUser.totalSpent ?? 0) + caseItem.price,
    lastSeenAt: new Date().toISOString()
  });

  ticketBalance.textContent = String(nextTickets);
  bestRound.textContent = String(nextBestRound);
  renderAdminPanel();
  renderUpgrader();

  return netResult;
}

async function runSpin() {
  const selectedCase = getSelectedCase();

  if (isBannedAccount(state.currentUser)) {
    roundMessage.textContent = "Аккаунт забанен. Открытие кейсов недоступно.";
    return;
  }

  if (!selectedCase || state.spinning || state.upgrading || !canAffordCase(selectedCase)) {
    if (selectedCase && !canAffordCase(selectedCase)) {
      roundMessage.textContent = "Недостаточно билетов. Сначала начисли баланс через админку.";
    }
    return;
  }

  state.spinning = true;
  delete reelTrack.dataset.locked;
  updateSelectionUi();
  renderUpgrader();
  roundTotal.textContent = "0 билетов";
  roundMessage.textContent = `Открываем кейс за ${selectedCase.price} билетов. Смотрим, окупится ли он.`;

  const targetDrop = pickRandomDrop(selectedCase.drops);
  const spinSequence = buildReelSequence(selectedCase.drops, targetDrop);
  reelTrack.innerHTML = buildReelMarkup(spinSequence.sequence);
  reelTrack.style.transition = "none";

  dropPreviewImage.src = selectedCase.image;
  dropPreviewImage.alt = selectedCase.name;
  dropPreviewValue.textContent = "Крутим...";
  dropPreviewName.textContent = "Определяем победный предмет";
  await wait(90);

  const reelItems = [...reelTrack.querySelectorAll(".reel-item")];
  const startItem = reelItems[spinSequence.startIndex];
  const targetItem = reelItems[spinSequence.targetIndex];
  const startOffset = getCenteredOffsetForItem(startItem);
  const centeredOffset = getCenteredOffsetForItem(targetItem);

  reelTrack.style.transform = `translateX(-${startOffset}px)`;
  await wait(40);

  const finalOffset = Math.max(0, centeredOffset);
  const phaseDuration = 7800;
  reelTrack.style.transition = `transform ${phaseDuration}ms cubic-bezier(0.08, 0.92, 0.14, 1)`;
  reelTrack.style.transform = `translateX(-${finalOffset}px)`;
  await wait(phaseDuration - 1400);
  roundMessage.textContent = "Прокрут замедляется... сейчас уже реально неясно, что встанет под линию.";
  await wait(1460);

  const actualCenteredItem = getCenteredReelItem();
  const actualDrop = getDropById(selectedCase, actualCenteredItem?.dataset.dropId) || targetDrop;

  [...reelTrack.querySelectorAll(".reel-item")].forEach((item) => item.classList.remove("is-winning"));
  if (actualCenteredItem) {
    actualCenteredItem.classList.add("is-winning");
  }

  dropPreviewImage.src = actualDrop.image;
  dropPreviewImage.alt = actualDrop.name;
  dropPreviewValue.textContent = formatTickets(actualDrop.tickets);
  dropPreviewName.textContent = actualDrop.label
    ? `${actualDrop.name} • шанс ${actualDrop.label}`
    : actualDrop.name;
  roundTotal.textContent = formatTickets(actualDrop.tickets);

  const netResult = applySpinEconomy(selectedCase, actualDrop.tickets);
  roundMessage.textContent = actualDrop.label
    ? "Выпал очень редкий кубок. Это реально топовый занос."
    : netResult >= 0
      ? `Открытие завершено. Окуп или плюс: +${netResult} билетов.`
      : `Открытие завершено. В этот раз минус ${Math.abs(netResult)} билетов.`;

  state.spinning = false;
  reelTrack.dataset.locked = "true";
  updateSelectionUi();
  renderUpgrader();
  renderAdminPanel();
}

function applyUpgradeEconomy(success, bet, payout) {
  if (!state.currentUser) {
    return 0;
  }

  const nextTickets = success
    ? Math.max(0, getCurrentBalance() - bet + payout)
    : Math.max(0, getCurrentBalance() - bet);
  const reward = success ? payout : 0;
  const netResult = success ? payout - bet : -bet;
  const nextBestRound = Math.max(state.currentUser.bestRound ?? 0, reward);

  updateStoredUser({
    tickets: nextTickets,
    bestRound: nextBestRound,
    totalSpins: (state.currentUser.totalSpins ?? 0) + 1,
    totalSpent: (state.currentUser.totalSpent ?? 0) + bet,
    lastSeenAt: new Date().toISOString()
  });

  ticketBalance.textContent = String(nextTickets);
  bestRound.textContent = String(nextBestRound);
  renderAdminPanel();

  return netResult;
}

function getUpgradeLanding(visibleChancePercent, effectiveChancePercent) {
  const { start, end } = getUpgradeSuccessArc(visibleChancePercent);
  const safePadding = 1.25;
  const successRoll = Math.random() * 100 < effectiveChancePercent;
  let localAngle = Math.random() * 360;

  if (successRoll) {
    for (let attempt = 0; attempt < 40; attempt += 1) {
      localAngle = Math.random() * 360;

      if (
        isUpgradeSuccessAngle(localAngle, visibleChancePercent) &&
        getCircularDistance(localAngle, start) > safePadding &&
        getCircularDistance(localAngle, end) > safePadding
      ) {
        break;
      }
    }
  } else {
    for (let attempt = 0; attempt < 40; attempt += 1) {
      localAngle = Math.random() * 360;

      if (!isUpgradeSuccessAngle(localAngle, visibleChancePercent)) {
        break;
      }
    }
  }

  return {
    localAngle: normalizeAngle(localAngle),
    success: isUpgradeSuccessAngle(localAngle, visibleChancePercent),
    stopRotation: normalizeAngle(180 - localAngle)
  };
}

async function runUpgrade() {
  if (isBannedAccount(state.currentUser)) {
    upgraderStatus.textContent = "Аккаунт забанен. Апгрейд недоступен.";
    return;
  }

  if (state.upgrading || state.spinning || !canAffordUpgrade()) {
    if (!canAffordUpgrade()) {
      upgraderStatus.textContent = "Нужно минимум 25 билетов, чтобы зайти в апгрейд.";
    }
    return;
  }

  const bet = normalizeUpgradeBet(upgradeBetInput.value);
  const multiplier = state.selectedUpgradeMultiplier;
  const payout = Math.round(bet * multiplier);
  const visibleChance = getUpgradeBaseChance(multiplier);
  const effectiveChance = getUpgradeEffectiveChance(multiplier);
  const landing = getUpgradeLanding(visibleChance, effectiveChance);
  const success = landing.success;
  const currentAngle = normalizeAngle(state.upgradeRotation);
  const delta = 2160 + normalizeAngle(landing.stopRotation - currentAngle);

  state.upgradeBet = bet;
  state.upgrading = true;
  upgradeWheelDisc.classList.add("is-spinning");
  renderUpgrader();
  upgradeLastResult.textContent = "Колесо крутится";

  state.upgradeRotation += delta;
  upgradeWheelDisc.style.transition = "transform 6200ms cubic-bezier(0.08, 0.92, 0.12, 1)";
  upgradeWheelDisc.style.transform = `rotate(${state.upgradeRotation}deg)`;

  await wait(5000);
  upgraderStatus.textContent = "Интрига пошла. Сейчас стрелка покажет, заносишь ты или сгораешь.";
  await wait(1300);

  const renderedRotation = getRenderedWheelRotation();
  const finalPointerAngle = getUpgradePointerAngleFromRotation(renderedRotation);
  const actualSuccess = isUpgradeSuccessAngle(finalPointerAngle, visibleChance);
  const successLabel = actualSuccess ? "попадание в жёлтый сектор" : "попадание в красный сектор";

  const netResult = applyUpgradeEconomy(actualSuccess, bet, payout);
  const target = getUpgradeTargetDescriptor(multiplier, payout);

  upgradeTargetImage.src = target.image;
  upgradeTargetImage.alt = target.name;
  upgradeTargetName.textContent = actualSuccess ? `${target.name} забран` : `${target.name} сорван`;
  upgradeTargetValue.textContent = actualSuccess ? `${payout} билетов` : `0 билетов`;
  upgradePayoutValue.textContent = String(actualSuccess ? payout : 0);
  upgradeLastResult.textContent = actualSuccess
    ? `плюс ${payout}`
    : `минус ${bet}`;
  upgraderStatus.textContent = actualSuccess
    ? `Апгрейд прошёл: ${successLabel}. Чистый плюс ${netResult} билетов.`
    : `Апгрейд сгорел: ${successLabel}. Потеря ${Math.abs(netResult)} билетов.`;

  state.upgradeRotation = renderedRotation;
  state.upgrading = false;
  upgradeWheelDisc.classList.remove("is-spinning");
  renderUser();
}

function logout() {
  state.currentUser = null;
  state.selectedCaseId = null;
  state.selectedUpgradeMultiplier = 2;
  state.upgradeBet = MIN_UPGRADE_BET;
  state.spinning = false;
  state.upgrading = false;
  state.adminPanelOpen = false;
  state.messagesOpen = false;
  state.view = "cases";
  state.upgradeRotation = 0;
  delete reelTrack.dataset.locked;
  clearSession();
  authForm.reset();
  setMode("login");
  renderUser();
  renderCaseGrid();
  updateSelectionUi();
  renderUpgrader();
  roundTotal.textContent = "0 билетов";
  roundMessage.textContent = "Сессия завершена. Войди снова, чтобы продолжить.";
}

function saveAvatarToAccount(dataUrl) {
  if (!state.currentUser) {
    return;
  }

  updateStoredUser({
    avatarDataUrl: dataUrl
  });

  updateAvatarPreview();
  renderAdminPanel();
}

function saveTradeLink() {
  if (!state.currentUser) {
    return;
  }

  const tradeLink = normalizeTradeLink(tradeLinkInput.value);

  if (!tradeLink) {
    tradeStatus.textContent = "Вставь trade ссылку перед сохранением.";
    return;
  }

  updateStoredUser({
    tradeLink
  });
  tradeStatus.textContent = "Trade ссылка сохранена.";
  updateTradeUi();
  renderAdminPanel();
}

function submitWithdrawRequest() {
  if (!state.currentUser) {
    return;
  }

  if (isBannedAccount(state.currentUser)) {
    tradeStatus.textContent = "Аккаунт забанен. Вывод недоступен.";
    return;
  }

  const tradeLink = normalizeTradeLink(state.currentUser.tradeLink ?? tradeLinkInput.value);
  const amount = Math.floor(Number(withdrawAmountInput.value));

  if (!tradeLink) {
    tradeStatus.textContent = "Сначала сохрани trade ссылку.";
    return;
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    tradeStatus.textContent = "Введи нормальную сумму для вывода.";
    return;
  }

  if (amount > getCurrentBalance()) {
    tradeStatus.textContent = "Нельзя запросить больше билетов, чем у тебя есть.";
    return;
  }

  if (!state.currentUser.tradeLink) {
    updateStoredUser({
      tradeLink
    });
  }

  const requests = getWithdrawRequests();
  requests.unshift({
    id: `${state.currentUser.username}-${Date.now()}`,
    username: state.currentUser.username,
    amount,
    tradeLink,
    createdAt: new Date().toISOString(),
    status: "new"
  });
  saveWithdrawRequests(requests);

  withdrawAmountInput.value = "";
  tradeStatus.textContent = `Заявка на вывод ${amount} билетов отправлена петрушке.`;
  renderMessagesPanel();
}

avatarInput.addEventListener("change", () => {
  const [file] = avatarInput.files || [];

  if (!file) {
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    if (typeof reader.result === "string") {
      saveAvatarToAccount(reader.result);
    }
  };
  reader.readAsDataURL(file);
});

adminButton.addEventListener("click", () => {
  state.adminPanelOpen = !state.adminPanelOpen;
  renderAdminPanel();
});

adminCloseButton.addEventListener("click", () => {
  state.adminPanelOpen = false;
  renderAdminPanel();
});

messagesButton.addEventListener("click", () => {
  if (!isAdminUser(state.currentUser?.username)) {
    return;
  }

  state.messagesOpen = !state.messagesOpen;
  renderMessagesPanel();
});

messagesCloseButton.addEventListener("click", () => {
  state.messagesOpen = false;
  renderMessagesPanel();
});

adminAccounts.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");

  if (!button || !isAdminUser(state.currentUser?.username)) {
    return;
  }

  const { action, username, value } = button.dataset;
  const account = loadUser(username);

  if (!account) {
    return;
  }

  const nextData = {
    ...account,
    lastSeenAt: new Date().toISOString()
  };

  if (action === "tickets-add") {
    nextData.tickets = (nextData.tickets ?? 0) + Number(value);
  }

  if (action === "tickets-sub") {
    nextData.tickets = Math.max(0, (nextData.tickets ?? 0) - Number(value));
  }

  if (action === "luck-add") {
    nextData.luckMultiplier = clamp((nextData.luckMultiplier ?? 1) + Number(value), 0.25, 3);
  }

  if (action === "luck-sub") {
    nextData.luckMultiplier = clamp((nextData.luckMultiplier ?? 1) - Number(value), 0.25, 3);
  }

  if (action === "luck-reset") {
    nextData.luckMultiplier = 1;
  }

  if (action === "ban" && username !== "petrushka228") {
    nextData.banned = true;
  }

  if (action === "unban") {
    nextData.banned = false;
  }

  saveUser(username, nextData);

  if (state.currentUser?.username === username) {
    refreshCurrentUserFromStore();
    renderUser();
  } else {
    renderAdminPanel();
  }

  if (state.view === "upgrader") {
    renderUpgrader();
  }
});

messagesList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-request-action]");

  if (!button || !isAdminUser(state.currentUser?.username)) {
    return;
  }

  const { requestAction, requestId } = button.dataset;
  const requests = getWithdrawRequests();

  if (requestAction === "remove") {
    saveWithdrawRequests(requests.filter((request) => request.id !== requestId));
    renderMessagesPanel();
    return;
  }

  if (requestAction === "done") {
    saveWithdrawRequests(requests.map((request) => (
      request.id === requestId
        ? { ...request, status: "closed" }
        : request
    )));
    renderMessagesPanel();
  }
});

authForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const username = usernameInput.value;
  const password = passwordInput.value;

  if (state.mode === "register") {
    await handleRegister(username, password, confirmPasswordInput.value);
    return;
  }

  await handleLogin(username, password);
});

tabLogin.addEventListener("click", () => setMode("login"));
tabRegister.addEventListener("click", () => setMode("register"));
logoutButton.addEventListener("click", logout);
spinButton.addEventListener("click", runSpin);
saveTradeLinkButton.addEventListener("click", saveTradeLink);
withdrawButton.addEventListener("click", submitWithdrawRequest);
casesNavButton.addEventListener("click", () => setView("cases"));
upgraderNavButton.addEventListener("click", () => setView("upgrader"));
upgradeButton.addEventListener("click", runUpgrade);

upgradeBetRange.addEventListener("input", () => {
  state.upgradeBet = normalizeUpgradeBet(upgradeBetRange.value);
  renderUpgrader();
});

upgradeBetInput.addEventListener("change", () => {
  state.upgradeBet = normalizeUpgradeBet(upgradeBetInput.value);
  renderUpgrader();
});

upgradeBetInput.addEventListener("blur", () => {
  state.upgradeBet = normalizeUpgradeBet(upgradeBetInput.value);
  renderUpgrader();
});

upgradeMultipliers.addEventListener("click", (event) => {
  const button = event.target.closest("[data-upgrade-multiplier]");

  if (!button || state.upgrading || state.spinning) {
    return;
  }

  state.selectedUpgradeMultiplier = Number(button.dataset.upgradeMultiplier);
  renderUpgrader();
});

window.addEventListener("storage", (event) => {
  if (!event.key || (event.key !== STORAGE_KEYS.accounts && event.key !== STORAGE_KEYS.session && event.key !== STORAGE_KEYS.withdrawRequests)) {
    return;
  }

  if (state.currentUser) {
    refreshCurrentUserFromStore();
    renderUser();
    return;
  }

  renderAdminPanel();
  renderMessagesPanel();
});

function restoreSession() {
  const session = getSession();
  renderCaseGrid();
  updateSelectionUi();
  renderUpgrader();

  if (!session?.username) {
    return;
  }

  const account = loadUser(session.username);

  if (!account) {
    clearSession();
    return;
  }

  setCurrentUser(session.username);
}

setMode("login");
restoreSession();

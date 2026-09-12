import type { Case } from "./schema";

export const cases: Case[] = [
  {
    slug: "blackjack-nextjs",
    order: 1,
    year: 2025,
    clientType: { uk: "Продуктова команда", en: "Product team" },
    title: { uk: "Гра Blackjack на Next.js", en: "Blackjack game on Next.js" },
    summary: {
      uk: "Доробка і розширення браузерної гри: логіка раундів, ставки, стан гравця.",
      en: "Extending a browser card game: round logic, bets, player state.",
    },
    stack: ["Next.js", "React", "TypeScript", "Tailwind"],
    budgetUAH: [20000, 25000],
    body: {
      task: {
        uk: ["Замовник мав частково готову гру Blackjack на Next.js і потребував довести її до робочого стану: виправити логіку роздачі, додати ставки і коректний підрахунок результатів раунду."],
        en: ["The client had a half-finished Blackjack game on Next.js and needed it working: fixed dealing logic, betting, and correct round scoring."],
      },
      work: {
        uk: [
          "Розібрав існуючий код, виніс ігрову логіку в окремий чистий модуль з тестами.",
          "Реалізував ставки, split і double, стан гравця між раундами.",
          "Переробив інтерфейс столу: анімації карт, адаптив під мобільні.",
        ],
        en: [
          "Untangled the existing code and moved the game logic into a separate pure module with tests.",
          "Implemented bets, split and double, and player state across rounds.",
          "Rebuilt the table UI: card animations and a mobile layout.",
        ],
      },
      result: {
        uk: ["Гра запущена, правила відповідають класичному Blackjack, оцінка замовника 10 з 10."],
        en: ["The game shipped with classic Blackjack rules. Client rating 10 out of 10."],
      },
    },
  },
  {
    slug: "shop-storefront-catalog",
    order: 2,
    year: 2026,
    clientType: { uk: "Інтернет-магазин", en: "Online shop" },
    title: { uk: "Нова вітрина і каталог для інтернет-магазину", en: "New storefront and catalog for an online shop" },
    summary: {
      uk: "Сім проєктів з одним замовником: вітрина, каталог, кошик, новий функціонал магазину.",
      en: "Seven projects with one client: storefront, catalog, cart, new shop features.",
    },
    stack: ["PHP", "JavaScript", "MySQL", "OpenCart"],
    budgetUAH: [3000, 14000],
    body: {
      task: {
        uk: ["Магазин на PHP з великою кількістю власних доробок. Потрібно було послідовно оновити вітрину, зробити новий каталог, переробити кошик і додати функції, які давно висіли в планах."],
        en: ["A PHP shop with years of custom modifications. The client needed the storefront refreshed, a new catalog, a reworked cart, and features that had been stuck on the backlog."],
      },
      work: {
        uk: [
          "Нова вітрина і головна сторінка без зламу існуючих модулів.",
          "Каталог з фільтрами і швидким пошуком по товарах.",
          "Доробка кошика і оформлення замовлення.",
          "Кілька раундів нового функціоналу за побажаннями замовника.",
        ],
        en: [
          "New storefront and home page without breaking existing modules.",
          "Catalog with filters and fast product search.",
          "Cart and checkout rework.",
          "Several rounds of new features requested by the client.",
        ],
      },
      result: {
        uk: ["Сім завершених проєктів поспіль, кожен з оцінкою 10 з 10. Замовник повертається з новими задачами."],
        en: ["Seven completed projects in a row, each rated 10 out of 10. The client keeps coming back with new work."],
      },
    },
  },
  {
    slug: "site-security-cleanup",
    order: 3,
    year: 2026,
    clientType: { uk: "Власник сайту", en: "Site owner" },
    title: { uk: "Чистка і захист зараженого сайту", en: "Cleaning and hardening a compromised site" },
    summary: {
      uk: "Діагностика зараження, видалення шкідливого коду, закриття дірок і захист від повторення.",
      en: "Diagnosing the infection, removing malicious code, closing the holes, preventing a repeat.",
    },
    stack: ["WordPress", "PHP", "Linux", "Security"],
    budgetUAH: [5000, 5000],
    body: {
      task: {
        uk: ["Сайт замовника був заражений: редиректи, сторонній код у файлах, підозріле навантаження. Потрібно було швидко знайти причину і надійно закрити її."],
        en: ["The client's site was compromised: redirects, injected code in files, suspicious load. It needed a fast diagnosis and a durable fix."],
      },
      work: {
        uk: [
          "Провів діагностику і пояснив замовнику, що саме сталося і що буду робити.",
          "Видалив шкідливий код, оновив вразливі компоненти, змінив доступи.",
          "Налаштував захист від ботів і моніторинг, тримав замовника в курсі на кожному кроці.",
        ],
        en: [
          "Ran the diagnosis and explained to the client what happened and what I would do.",
          "Removed the malicious code, updated vulnerable components, rotated credentials.",
          "Set up bot protection and monitoring, keeping the client informed at every step.",
        ],
      },
      result: {
        uk: ["Сайт чистий і працює, повторних заражень немає. Відгук замовника: професійний підхід, рекомендую."],
        en: ["The site is clean and stable with no reinfection. Client review: professional approach, recommended."],
      },
    },
  },
  {
    slug: "agency-site-improvements",
    order: 4,
    year: 2026,
    clientType: { uk: "Агенція", en: "Agency" },
    title: { uk: "Доробка сайту для агенції, два раунди", en: "Site improvements for an agency, two rounds" },
    summary: {
      uk: "Правки в чужому коді, нові блоки і функції, робота за задачами агенції.",
      en: "Fixes in someone else's code, new blocks and features, working from the agency's task list.",
    },
    stack: ["PHP", "JavaScript", "CSS", "CMS"],
    budgetUAH: [4500, 7000],
    body: {
      task: {
        uk: ["Агенція вела клієнтський сайт і потребувала розробника, який розбереться в існуючому коді і зробить список доробок без переписування всього."],
        en: ["An agency maintaining a client site needed a developer to work inside the existing code and deliver a list of improvements without a rewrite."],
      },
      work: {
        uk: [
          "Перший раунд: виправлення помилок і кілька нових блоків.",
          "Другий раунд: більший обсяг функціоналу, частина зроблена понад список.",
        ],
        en: [
          "Round one: bug fixes and a few new blocks.",
          "Round two: a larger set of features, some delivered beyond the list.",
        ],
      },
      result: {
        uk: ["Обидва раунди завершені, агенція продовжила співпрацю. Оцінки 10 і 9.8."],
        en: ["Both rounds completed and the agency continued the collaboration. Ratings 10 and 9.8."],
      },
    },
  },
  {
    slug: "1c-omnichannel-spec",
    order: 5,
    year: 2026,
    clientType: { uk: "Роздрібна компанія", en: "Retail company" },
    title: { uk: "ТЗ на інтеграцію месенджерів у кастомну 1С", en: "Spec for messenger integration into custom 1C" },
    summary: {
      uk: "Технічне завдання для омніканальної комунікації: месенджери і соцмережі всередині 1С.",
      en: "A technical specification for omnichannel communication: messengers and social networks inside 1C.",
    },
    stack: ["Аналітика", "API", "1C", "Telegram"],
    budgetUAH: [3000, 3000],
    body: {
      task: {
        uk: ["Компанія хотіла отримувати повідомлення з месенджерів і соцмереж прямо у своїй кастомній 1С. Перед розробкою потрібне було чітке ТЗ, за яким зможе працювати будь-який підрядник."],
        en: ["The company wanted messages from messengers and social networks inside their custom 1C system. Before development they needed a clear spec any contractor could build from."],
      },
      work: {
        uk: [
          "Зібрав вимоги, описав сценарії роботи менеджерів.",
          "Описав API кожного каналу, схему даних і обробку помилок.",
          "Оформив ТЗ з етапами і критеріями приймання.",
        ],
        en: [
          "Gathered requirements and described the managers' workflows.",
          "Documented each channel's API, the data model, and error handling.",
          "Delivered the spec with phases and acceptance criteria.",
        ],
      },
      result: {
        uk: ["ТЗ прийняте, оцінка 10 з 10."],
        en: ["Spec accepted, rated 10 out of 10."],
      },
    },
  },
  {
    slug: "dating-platforms-frontend",
    order: 6,
    year: 2025,
    clientType: { uk: "Продуктова команда", en: "Product team" },
    title: { uk: "Фронтенд дейтинг-платформ", en: "Frontend for dating platforms" },
    summary: {
      uk: "Робота в продуктовій команді над flirtfordate.com і bez-kompleksov.com: інтерфейси, адаптив, стабільність.",
      en: "In-house frontend work on flirtfordate.com and bez-kompleksov.com: interfaces, responsive layouts, stability.",
    },
    stack: ["React", "TypeScript", "HTML", "CSS"],
    link: "https://flirtfordate.com/",
    body: {
      task: {
        uk: ["Два дейтинг-сервіси з великою аудиторією потребували стабільного, адаптивного інтерфейсу, який однаково працює на різних пристроях."],
        en: ["Two dating services with a large audience needed a stable, responsive interface that behaves the same across devices."],
      },
      work: {
        uk: [
          "Верстка і логіка інтерфейсів на React і TypeScript.",
          "Адаптив під мобільні, робота з командою над зручністю і доступністю.",
        ],
        en: [
          "Interface markup and logic in React and TypeScript.",
          "Mobile layouts, and collaboration with the team on usability and accessibility.",
        ],
      },
      result: {
        uk: ["Інтерфейси працюють стабільно, залученість користувачів зросла."],
        en: ["The interfaces run reliably and user engagement went up."],
      },
    },
  },
  {
    slug: "client-portfolio-admin",
    order: 7,
    year: 2025,
    clientType: { uk: "Приватний замовник", en: "Private client" },
    title: { uk: "Сайт-портфоліо з адмін-панеллю", en: "Portfolio site with an admin panel" },
    summary: {
      uk: "Сайт за наданим дизайном за 15 днів: адмінка, керування продуктами, редагування розділу про себе.",
      en: "A site from a provided design in 15 days: admin panel, product management, editable about section.",
    },
    stack: ["React", "Node.js", "Express", "MongoDB"],
    link: "https://portfolio-client-o34s.onrender.com/",
    budgetUAH: [1500, 1500],
    body: {
      task: {
        uk: ["Замовник надав дизайн і хотів сайт, яким зможе керувати сам: додавати продукти, змінювати аватар і текст про себе, вставляти посилання на портфоліо."],
        en: ["The client provided a design and wanted a site they could manage themselves: add products, change the avatar and about text, link their portfolio."],
      },
      work: {
        uk: ["Верстка за дизайном, адмін-панель з авторизацією, CRUD для продуктів і завантаження зображень."],
        en: ["Markup from the design, an admin panel with auth, product CRUD, and image upload."],
      },
      result: {
        uk: ["Здано за 15 днів. Зараз сайт живе своїм життям за бажанням замовника."],
        en: ["Delivered in 15 days. The site has since taken on a life of its own, by the client's choice."],
      },
    },
  },
];

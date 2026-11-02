import type { Case } from "./schema";

export const cases: Case[] = [
  {
    slug: "comarch-edi-baf",
    order: 1,
    year: 2026,
    clientType: { uk: "Постачальник торговельних мереж", en: "Supplier to retail chains" },
    title: { uk: "Замовлення з Comarch EDI автоматично в BAF", en: "Comarch EDI orders flowing into BAF automatically" },
    summary: {
      uk: "Замовлення торговельних мереж самі стають накладними в BAF кожні 5 хвилин, а повідомлення про відвантаження формуються при проведенні.",
      en: "Retail chain orders turn into BAF sales invoices every 5 minutes on their own, and dispatch advices are built when an invoice is posted.",
    },
    stack: ["1C / BAF", "BSL", "SOAP", "Comarch EDI", "PowerShell"],
    budgetUAH: [3000, 3000],
    body: {
      task: {
        uk: ["Компанія отримувала замовлення від кількох торговельних мереж через Comarch EDI, і менеджер вручну переносив кожне в BAF: покупця, точку доставки, товари, ціни. Потрібно було, щоб замовлення ставали непроведеними накладними самі, без ризику для робочої бази."],
        en: ["The company received orders from several retail chains through Comarch EDI, and a manager re-typed each one into BAF: buyer, delivery point, items, prices. The goal was to have orders become draft sales invoices automatically, without risking the live database."],
      },
      work: {
        uk: [
          "Підключився до Comarch EDI Web Service (SOAP): отримання документів, підтвердження прочитаного, обробка кодів помилок без блокування логіну.",
          "Зробив розширення BAF замість правок конфігурації. Журнал за номером документа гарантує, що одне замовлення ніколи не стане двома накладними.",
          "Зіставлення покупця і точки доставки за GLN, товарів за штрихкодом, окреме правило для штрихкодів, що повторюються.",
          "Регламентне завдання кожні 5 хвилин. Усе спершу прогнав на копії бази, перед установкою зробив і перевірив бекап.",
          "Наступною доробкою додав автоматичні DESADV: повідомлення про відвантаження формується при проведенні накладної, з шаблоном під кожну мережу.",
        ],
        en: [
          "Connected to the Comarch EDI Web Service (SOAP): receiving documents, confirming them, and handling error codes without locking the login.",
          "Built a BAF extension instead of editing the configuration. A journal keyed by document number guarantees one order never becomes two invoices.",
          "Matched buyers and delivery points by GLN and items by barcode, with a dedicated rule for duplicated barcodes.",
          "A scheduled job every 5 minutes. Everything ran on a copy of the database first, and the backup was verified before installing.",
          "As a follow-up, added automatic DESADV: the dispatch advice is built when the invoice is posted, with a template for each chain.",
        ],
      },
      result: {
        uk: ["У перший робочий день 41 замовлення стали накладними без жодної помилки, суми з ПДВ збіглися з порталом. Оцінка 10 з 10, замовник одразу замовив наступну доробку."],
        en: ["On the first working day 41 orders became invoices with zero errors, and totals with VAT matched the portal. Rated 10 out of 10, and the client ordered the next improvement right away."],
      },
    },
  },
  {
    slug: "auto-parts-shop-seo",
    order: 2,
    year: 2026,
    clientType: { uk: "Мережа інтернет-магазинів", en: "E-commerce network" },
    title: { uk: "SEO, верстка і сервер для мережі магазинів автозапчастин", en: "SEO, layout and server work for an auto parts store network" },
    summary: {
      uk: "Одинадцять проєктів поспіль для магазинів на Shop-Script: технічне SEO, категорії, верстка за Figma, переїзд на новий сервер.",
      en: "Eleven projects in a row for Shop-Script stores: technical SEO, categories, layout from Figma, and a move to a new server.",
    },
    stack: ["Shop-Script", "Webasyst", "PHP", "SEO", "Nginx", "Python"],
    body: {
      task: {
        uk: ["Мережа магазинів запчастин на Shop-Script з багатьма регіональними доменами втрачала позиції в пошуку. Половина адрес у sitemap була закрита від індексації, canonical суперечили один одному, сторінки вантажились повільно."],
        en: ["A network of parts stores on Shop-Script with many regional domains was losing search positions. Half of the URLs in the sitemap were closed from indexing, canonical tags contradicted each other, and pages loaded slowly."],
      },
      work: {
        uk: [
          "Технічне SEO: чистий sitemap, один canonical, robots.txt під параметри Shop-Script, H1, виправлення всіх помилок з аудиту Semrush.",
          "Категорії під загальні запити і розмітка товарів для пошукових систем.",
          "Верстка за Figma: блок популярних категорій з підкатегоріями, галерея товару, особистий кабінет.",
          "301 редиректи для старих адрес товарів, прискорення сторінок, meta description.",
          "Переїзд на новий сервер: PHP 8.3, 16 регламентних задач, оптимізація бази і nginx.",
        ],
        en: [
          "Technical SEO: a clean sitemap, a single canonical, robots.txt tuned to Shop-Script parameters, H1, and every error from the Semrush audit fixed.",
          "Category pages for broad queries and product markup for search engines.",
          "Layout from Figma: a popular categories block with subcategories, a product gallery, and the customer account.",
          "301 redirects for old product URLs, faster pages, meta descriptions.",
          "A move to a new server: PHP 8.3, 16 cron jobs, database and nginx tuning.",
        ],
      },
      result: {
        uk: ["Одинадцять завершених проєктів, кожен з оцінкою 10 з 10. Замовник повертається з новими задачами."],
        en: ["Eleven completed projects, each rated 10 out of 10. The client keeps coming back with new tasks."],
      },
    },
  },
  {
    slug: "blackjack-nextjs",
    order: 3,
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
    order: 4,
    year: 2026,
    clientType: { uk: "Інтернет-магазин", en: "Online shop" },
    title: { uk: "Нова вітрина і каталог для інтернет-магазину", en: "New storefront and catalog for an online shop" },
    summary: {
      uk: "Сім проєктів з одним замовником: вітрина, каталог, кошик, новий функціонал магазину.",
      en: "Seven projects with one client: storefront, catalog, cart, new shop features.",
    },
    stack: ["PHP", "JavaScript", "MySQL", "Shop-Script"],
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
    order: 5,
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
    order: 6,
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
    order: 7,
    year: 2026,
    clientType: { uk: "Роздрібна компанія", en: "Retail company" },
    title: { uk: "Інтеграція месенджерів у кастомну 1С", en: "Messenger integration into custom 1C" },
    summary: {
      uk: "Від ТЗ до робочої інтеграції: повідомлення з Telegram і Viber через Chatwoot потрапляють прямо в 1С.",
      en: "From spec to a working integration: Telegram and Viber messages reach 1C directly through Chatwoot.",
    },
    stack: ["1C", "BSL", "Chatwoot", "Telegram", "Viber", "API"],
    budgetUAH: [3000, 7000],
    body: {
      task: {
        uk: ["Компанія хотіла отримувати повідомлення з месенджерів і соцмереж прямо у своїй кастомній 1С. Спершу потрібне було чітке ТЗ, потім реалізація в робочій конфігурації без ламання наявних інтеграцій."],
        en: ["The company wanted messages from messengers and social networks inside their custom 1C system. First they needed a clear spec, then an implementation in the live configuration without breaking existing integrations."],
      },
      work: {
        uk: [
          "Зібрав вимоги, описав сценарії роботи менеджерів, API кожного каналу і схему даних, оформив ТЗ з критеріями приймання.",
          "Підключив Chatwoot як агрегатор каналів Telegram і Viber.",
          "Додав у HTTP-сервіс 1С новий метод для приймання повідомлень і регістр історії із захистом від дублів.",
          "Зробив інтерфейс для менеджерів у 1С і перевірив усе на тестовій базі до викочування.",
        ],
        en: [
          "Gathered requirements, described the managers' workflows, each channel's API and the data model, and delivered a spec with acceptance criteria.",
          "Connected Chatwoot as the aggregator for Telegram and Viber.",
          "Added a new method to the 1C HTTP service for incoming messages and a history register with duplicate protection.",
          "Built the managers' interface in 1C and tested everything on a test database before rollout.",
        ],
      },
      result: {
        uk: ["ТЗ прийняте з оцінкою 10 з 10, другий етап теж 10 з коментарем замовника: зроблено краще, ніж очікував."],
        en: ["The spec was accepted with a 10 out of 10, and the second stage got a 10 as well, with the client saying it turned out better than expected."],
      },
    },
  },
  {
    slug: "dating-platforms-frontend",
    order: 8,
    year: 2025,
    clientType: { uk: "Продуктова команда", en: "Product team" },
    title: { uk: "Фронтенд дейтинг-платформ", en: "Frontend for dating platforms" },
    summary: {
      uk: "Робота в продуктовій команді над flirtfordate.com і bez-kompleksov.com: інтерфейси, адаптив, стабільність.",
      en: "In-house frontend work on flirtfordate.com and bez-kompleksov.com: interfaces, responsive layouts, stability.",
    },
    stack: ["React", "TypeScript", "HTML", "CSS"],
    gallery: [{ src: "/cases/dating-platforms.webp", alt: { uk: "Головна сторінка flirtfordate.com", en: "flirtfordate.com home page" }, width: 1600, height: 1000 }],
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
    order: 9,
    year: 2025,
    clientType: { uk: "Приватний замовник", en: "Private client" },
    title: { uk: "Сайт-портфоліо з адмін-панеллю", en: "Portfolio site with an admin panel" },
    summary: {
      uk: "Сайт за наданим дизайном за 15 днів: адмінка, керування продуктами, редагування розділу про себе.",
      en: "A site from a provided design in 15 days: admin panel, product management, editable about section.",
    },
    stack: ["React", "Node.js", "Express", "MongoDB"],
    gallery: [{ src: "/cases/client-portfolio.webp", alt: { uk: "Головна сторінка сайту-портфоліо замовника", en: "Client portfolio site home page" }, width: 1600, height: 1000 }],
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

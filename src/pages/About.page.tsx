
export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6 bg-white dark:bg-gray-800 rounded-lg shadow-md mt-10">
      <h1 className="text-4xl font-bold text-center dark:text-white">
        About BCards
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        BCards is a modern web application that lets you browse, create, edit and
        save business cards—all in one place. Whether you’re a solo entrepreneur,
        a small business owner or just someone who needs to collect great contacts,
        BCards makes it easy to maintain a beautiful digital Rolodex.
      </p>

      <h2 className="text-2xl font-semibold dark:text-white">Key Features</h2>
      <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
        <li>Responsive grid of public business cards on the Home page</li>
        <li>
          Secure signup/login with JWT: your token is kept in localStorage and
          used for every protected request
        </li>
        <li>
          “My Cards” dashboard—view, edit or delete only the cards you’ve created
        </li>
        <li>Favorites system—click the heart on any card to save it locally</li>
        <li>Create new cards with a friendly form and live validation</li>
        <li>Edit existing cards in a pre-filled form, only for Business users</li>
        <li>Dark &amp; Light mode toggle for comfortable browsing any time</li>
        <li>User Profile—view your details and account type at a glance</li>
      </ul>

      <h2 className="text-2xl font-semibold dark:text-white">API Integration</h2>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        All data in BCards is served by our REST API at{" "}
        <a
          href="https://monkfish-app-z9uza.ondigitalocean.app"
          target="_blank"
          className="text-blue-500 hover:underline"
        >
          https://monkfish-app-z9uza.ondigitalocean.app
        </a>
        . We use{" "}
        <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">axios</code>{" "}
        to perform HTTP calls, sending your JWT in the{" "}
        <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">
          x-auth-token
        </code>{" "}
        header for authentication. Protected actions like creating, editing or
        deleting cards require a valid token obtained at login.
      </p>

      <h2 className="text-2xl font-semibold dark:text-white">Tech Stack</h2>
      <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
        <li>React + TypeScript for a type-safe UI</li>
        <li>Tailwind CSS + Flowbite for rapid, responsive styling</li>
        <li>React Router v6 for client-side routing</li>
        <li>Redux Toolkit for global state (user session)</li>
        <li>Joi for schema-based form validation</li>
        <li>JSON Web Tokens (JWT) for authentication</li>
        <li>DigitalOcean App Platform hosting the REST API</li>
      </ul>

      <p className="text-center text-gray-600 dark:text-gray-400">
        Thank you for visiting BCards. We hope this tool helps you manage your
        business connections with ease!
      </p>
    </div>
  );
}
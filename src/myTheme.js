const myTheme = {
  button: {
    primary: {
      base: "text-white bg-blue-600 border border-transparent",
      active:
        "active:bg-blue-600 hover:bg-blue-700 focus:ring focus:ring-blue-300",
    },
    danger: {
        base: 'text-white bg-red-600 border border-transparent',
        active: 'active:bg-red-600 hover:bg-red-700 focus:ring focus:ring-red-300',
        disabled: 'opacity-50 cursor-not-allowed',
    },
  },
  input: {
    base: 'block w-full text-sm focus:outline-none dark:text-gray-300 form-input leading-5 focus:border-gray-300 dark:border-gray-600 focus:ring focus:ring-blue-300 dark:focus:border-gray-600 dark:focus:ring-gray-300 dark:bg-gray-700 rounded-md border',
    active:
      "focus:border-gray-300 dark:border-gray-600 focus:ring focus:ring-blue-300 dark:focus:border-gray-600 dark:focus:ring-gray-300 dark:bg-gray-700 rounded-md",
    radio:
      "bg-gray-100 text-blue-600 form-radio focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-offset-0 dark:focus:ring-gray-300 dark:bg-gray-400",
    checkbox:
      "text-blue-600 form-checkbox focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-offset-0 rounded dark:focus:ring-gray-300",
  },
  badge: {
    primary: "text-blue-700 bg-blue-100 dark:text-white dark:bg-blue-600",
  },
  textarea: {
    base: 'block w-full min-h-full border text-sm dark:text-gray-300 form-textarea focus:outline-none focus:border-blue-400 border-gray-300 dark:border-gray-600 dark:focus:border-gray-600 dark:bg-gray-700 dark:focus:ring-gray-300 focus:ring focus:ring-blue-300 rounded-md',
    active:
      "focus:border-blue-400 border-gray-300 dark:border-gray-600 dark:focus:border-gray-600 dark:bg-gray-700 dark:focus:ring-gray-300 focus:ring focus:ring-blue-300",
  },
  // Select
  select: {
    base: 'block w-full text-sm dark:text-gray-300 focus:outline-none focus:border-blue-400 border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring focus:ring-blue-300 dark:focus:ring-gray-300 dark:focus:border-gray-600 form-select leading-5 rounded-md border',
    active:
      "focus:border-blue-400 border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring focus:ring-blue-300 dark:focus:ring-gray-300 dark:focus:border-gray-600",
  },
  avatar: {
    base: 'relative rounded-full inline-block',
    size: {
      large: 'w-32 h-32',
      regular: 'w-8 h-8',
      small: 'w-6 h-6',
    },
  }
};

export default myTheme;

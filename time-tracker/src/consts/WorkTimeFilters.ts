export const PREDEFINED_FILTERS = {
  thisWeek: {
    label: "Ten tydzień",
    startDate: () => {
      const today = new Date();
      const day = today.getDay();
      const diff = today.getDate() - day + (day == 0 ? -6 : 1);
      return new Date(today.setDate(diff));
    },
    endDate: () => {
      const today = new Date();
      const day = today.getDay();
      const diff = today.getDate() - day + (day == 0 ? 0 : 7);
      return new Date(today.setDate(diff));
    },
  },
  lastWeek: {
    label: "Ostatni tydzień",
    startDate: () => {
      const today = new Date();
      const day = today.getDay();
      const diff = today.getDate() - day - 6;
      return new Date(today.setDate(diff));
    },
    endDate: () => {
      const today = new Date();
      const day = today.getDay();
      const diff = today.getDate() - day;
      return new Date(today.setDate(diff));
    },
  },
  thisMonth: {
    label: "Ten miesiąc",
    startDate: () => {
      const today = new Date();
      return new Date(today.getFullYear(), today.getMonth(), 1);
    },
    endDate: () => {
      const today = new Date();
      return new Date(today.getFullYear(), today.getMonth() + 1, 0);
    },
  },
  lastMonth: {
    label: "Ostatni miesiąc",
    startDate: () => {
      const today = new Date();
      return new Date(today.getFullYear(), today.getMonth() - 1, 1);
    },
    endDate: () => {
      const today = new Date();
      return new Date(today.getFullYear(), today.getMonth(), 0);
    },
  },
  thisYear: {
    label: "Ten rok",
    startDate: () => {
      const today = new Date();
      return new Date(today.getFullYear(), 0, 1);
    },
    endDate: () => {
      const today = new Date();
      return new Date(today.getFullYear() + 1, 0, 0);
    },
  },
  lastYear: {
    label: "Ostatni rok",
    startDate: () => {
      const today = new Date();
      return new Date(today.getFullYear() - 1, 0, 1);
    },
    endDate: () => {
      const today = new Date();
      return new Date(today.getFullYear(), 0, 0);
    },
  },
};

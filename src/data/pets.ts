import { ImageSourcePropType } from "react-native";
export type Pet = {
  id: string;
  name: string;
  age: string;
  ageGroup: string;
  city: string;
  kind: string;
  sex: string;
  size: string;
  weight: string;
  tags: string[];
  compatible: string[];
  shelter: string;
  photo: ImageSourcePropType;
  story: string;
  vaccinated: boolean;
  sterilized: boolean;
  special: boolean;
};
const story =
  "Дуже чекає на свою людину. Любить прогулянки, лагідні обійми та маленькі щоденні пригоди. У притулку допоможуть познайомитися й розкажуть усе про звички та догляд.";
export const pets: Pet[] = [
  {
    id: "luna",
    name: "Луна",
    age: "2 роки",
    ageGroup: "Дорослий",
    city: "Дніпро",
    kind: "Собака",
    sex: "Дівчинка",
    size: "M",
    weight: "5–15 кг",
    tags: ["Лагідна", "Любить дітей", "Вакцинована"],
    compatible: ["Діти", "Коти", "Люди"],
    shelter: "Чотири лапи",
    photo: require("../../assets/pets/luna.jpg"),
    story:
      "Луна прийшла до нас навесні. Вона швидко вчиться, добре ходить на повідку і дуже прив’язується до людей. Шукає родину, де її будуть любити й гуляти щодня.",
    vaccinated: true,
    sterilized: true,
    special: false,
  },
  {
    id: "max",
    name: "Макс",
    age: "2 роки",
    ageGroup: "Дорослий",
    city: "Київ",
    kind: "Собака",
    sex: "Хлопчик",
    size: "S",
    weight: "до 5 кг",
    tags: ["Спокійний", "Добрий"],
    compatible: ["Діти", "Собаки", "Люди"],
    shelter: "Щасливий хвіст",
    photo: require("../../assets/pets/max.jpg"),
    story:
      "Макс спокійний і вірний. Любить довгі прогулянки й тихі вечори вдома. Найкраще почувається поруч зі своєю людиною.",
    vaccinated: true,
    sterilized: true,
    special: false,
  },
  {
    id: "sonya",
    name: "Соня",
    age: "2 місяці",
    ageGroup: "Малюк",
    city: "Львів",
    kind: "Собака",
    sex: "Дівчинка",
    size: "S",
    weight: "до 5 кг",
    tags: ["Грайлива", "Малюк"],
    compatible: ["Діти", "Коти", "Собаки"],
    shelter: "Лапа допомоги",
    photo: require("../../assets/pets/sonya.jpg"),
    story,
    vaccinated: true,
    sterilized: false,
    special: false,
  },
  {
    id: "reks",
    name: "Рекс",
    age: "6 років",
    ageGroup: "Старший",
    city: "Харків",
    kind: "Собака",
    sex: "Хлопчик",
    size: "L",
    weight: "15–25 кг",
    tags: ["Спокійний", "Добрий"],
    compatible: ["Люди", "Собаки"],
    shelter: "Тепла оселя",
    photo: require("../../assets/pets/reks.jpg"),
    story,
    vaccinated: true,
    sterilized: true,
    special: true,
  },
  {
    id: "baks",
    name: "Бакс",
    age: "3 роки",
    ageGroup: "Дорослий",
    city: "Київ",
    kind: "Кіт",
    sex: "Хлопчик",
    size: "S",
    weight: "до 5 кг",
    tags: ["Лагідний", "Добрий"],
    compatible: ["Коти", "Люди"],
    shelter: "Добрі руки",
    photo: require("../../assets/pets/miya.jpg"),
    story,
    vaccinated: true,
    sterilized: true,
    special: false,
  },
  {
    id: "mira",
    name: "Міра",
    age: "4 роки",
    ageGroup: "Дорослий",
    city: "Одеса",
    kind: "Кіт",
    sex: "Дівчинка",
    size: "S",
    weight: "до 5 кг",
    tags: ["Спокійна", "Може жити з котами"],
    compatible: ["Коти", "Діти", "Люди"],
    shelter: "Добрі руки",
    photo: require("../../assets/pets/miya.jpg"),
    story,
    vaccinated: true,
    sterilized: true,
    special: false,
  },
  {
    id: "bonya",
    name: "Боня",
    age: "1 рік",
    ageGroup: "Молодий",
    city: "Київ",
    kind: "Собака",
    sex: "Дівчинка",
    size: "M",
    weight: "5–15 кг",
    tags: ["Активна", "Лагідна"],
    compatible: ["Діти", "Собаки", "Люди"],
    shelter: "Лапа допомоги",
    photo: require("../../assets/pets/bonya.jpg"),
    story,
    vaccinated: true,
    sterilized: false,
    special: false,
  },
  {
    id: "buddy",
    name: "Бадді",
    age: "8 місяців",
    ageGroup: "Молодий",
    city: "Львів",
    kind: "Собака",
    sex: "Хлопчик",
    size: "L",
    weight: "15–25 кг",
    tags: ["Активний", "Грайливий"],
    compatible: ["Собаки", "Коти", "Люди"],
    shelter: "Свій дім",
    photo: require("../../assets/pets/buddy.jpg"),
    story,
    vaccinated: true,
    sterilized: false,
    special: false,
  },
];
export const petById = (id: string) => pets.find((p) => p.id === id) ?? pets[0];

// "use client";
// import React, { useState, useEffect } from "react";
// import Header from "src/components/layout/Header";
// import InputField from "src/components/ui/InputField";
// import SearchResultCard from "src/features/search/ui/SearchResultCard";
// import SearchFilterTabs, {
//   SearchCategory,
// } from "src/features/search/ui/SearchFilterTabs";
// import SearchAdvancedFilter, {
//   SortOrder,
//   GenderFilter,
// } from "src/features/search/ui/SearchAdvancedFilter";

// export default function SearchPage() {
//   const [query, setQuery] = useState("");
//   const [currentCategory, setCurrentCategory] =
//     useState<SearchCategory>("interests");
//   const [advancedFilterOpen, setAdvancedFilterOpen] = useState(false);
//   const [sortOrder, setSortOrder] = useState<SortOrder>("desc"); // по умолчанию сортировка по убыванию совместимости
//   const [gender, setGender] = useState<GenderFilter>("all");
//   const [results, setResults] = useState<any[]>([]);

//   // Получение списка пользователей с сервера
//   useEffect(() => {
//     async function fetchUsers() {
//       try {
//         // Пример запроса к API. Передавайте параметры фильтрации и категорию поиска, если необходимо.
//         // const res = await fetch(/api/search/?category=${currentCategory}&query=${query}&gender=${gender});
//         // if (!res.ok) {
//         //   throw new Error("Ошибка получения списка пользователей");
//         // }
//         // const data = await res.json();
//         // setResults(data);

//         // Пока используем статические данные для тестирования:
//         const staticData = [
//           {
//             name: "Иван",
//             surname: "Иванов",
//             interests: ["Спорт", "Музыка"],
//             hobbies: ["Путешествия"],
//             musicTastes: ["Рок", "Джаз"],
//             gender: "male",
//             isFriend: false,
//             compatibility: 95,
//           },
//           {
//             name: "Мария",
//             surname: "Петрова",
//             interests: ["Чтение", "Кино"],
//             hobbies: ["Рисование"],
//             musicTastes: ["Поп", "Классика"],
//             gender: "female",
//             isFriend: true,
//             compatibility: 80,
//           },
//           {
//             name: "Алексей",
//             surname: "Сидоров",
//             interests: ["Спорт", "Музыка", "Кино"],
//             hobbies: ["Путешествия", "Фотография"],
//             musicTastes: ["Рок", "Джаз"],
//             gender: "male",
//             isFriend: false,
//             compatibility: 70,
//           },
//           {
//             name: "Екатерина",
//             surname: "Смирнова",
//             interests: ["Кино", "Искусство"],
//             hobbies: ["Рисование", "Кулинария"],
//             musicTastes: ["Поп", "Классика"],
//             gender: "female",
//             isFriend: false,
//             compatibility: 60,
//           },
//         ];
//         setResults(staticData);
//       } catch (error: any) {
//         console.error(error.message);
//       }
//     }
//     fetchUsers();
//   }, [currentCategory, query, gender]);

//   // Фильтрация по введённому запросу (по имени + фамилии)
//   const filteredResults = results.filter((user) => {
//     const fullName = ${user.name} ${user.surname}.toLowerCase();
//     return fullName.includes(query.toLowerCase());
//   });

//   // Сортировка: сначала по коэффициенту совместимости, затем по имени, если нужно
//   const sortedResults = filteredResults.sort((a, b) => {
//     if (sortOrder === "desc") {
//       return b.compatibility - a.compatibility;
//     } else {
//       return a.compatibility - b.compatibility;
//     }
//   });

//   // Фильтрация по полу
//   const finalResults =
//     gender === "all"
//       ? sortedResults
//       : sortedResults.filter((user) => user.gender === gender);

//   // Оценка: можно также сортировать по алфавиту, если выбран соответствующий параметр,
//   // например, используя a.name.localeCompare(b.name) после сортировки по коэффициенту.

//   // Функция для добавления в друзья
//   const handleAddFriend = (name: string) => {
//     console.log(Добавляем ${name} в друзья);
//     // Здесь можно добавить вызов API для отправки запроса на добавление в друзья
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 relative">
//       <Header />
//       <div className="max-w-2xl mx-auto py-10 px-4">
//         <h2 className="text-3xl font-bold mb-6 text-center">Поиск людей</h2>
//         {/* Переключение категорий поиска */}
//         <SearchFilterTabs
//           currentCategory={currentCategory}
//           onSelectCategory={setCurrentCategory}
//         />
//         <div className="relative mb-10">
//           {/* Кнопка для открытия контекстного меню фильтра */}
//           <button
//             onClick={() => setAdvancedFilterOpen(!advancedFilterOpen)}
//             className="absolute right-0 -bottom-8 px-3 py-1 bg-gray-300 rounded-br-xl hover:bg-gray-400"
//           >
//             Фильтр ▼
//           </button>
//           <InputField
//             label="Найти пользователя"
//             type="text"
//             placeholder="Введите имя или фамилию"
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//           />
//           {advancedFilterOpen && (
//             <SearchAdvancedFilter
//               sortOrder={sortOrder}
//               onSortOrderChange={setSortOrder}
//               gender={gender}
//               onGenderChange={setGender}
//               onClose={() => setAdvancedFilterOpen(false)}
//             />
//           )}
//         </div>
//         <div>
//           {finalResults.map((user, idx) => (
//             <SearchResultCard
//               key={idx}
//               name={${user.name} ${user.surname}}
//               description={Совместимость: ${user.compatibility}%}
//               isFriend={user.isFriend}
//               onAddFriend={() => handleAddFriend(user.name)}
//             />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

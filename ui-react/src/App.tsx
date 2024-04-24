import styles from "./App.module.css";
import '@fortawesome/fontawesome-free/css/all.min.css';

import TopMenu from "./components/TopMenu/TopMenu";
import leftNavItems from "./data/leftNavItems";
import { rightNavItems } from "./data/rightNavItems";


function App() {
  return (
    <main className={styles.App + " min-h-screen dark:text-white dark:bg-gray-900 dark:font-sans dark:font-thin dark:overflow-hidden"} >
      <TopMenu leftItems={leftNavItems} rightItems={rightNavItems}  />



    </main>
  );
}

export default App;

import MainPage from "./(user)/mainPage/page";
import MainSidebarLayout from "./(user)/mainSidebar/layout";
import RootLayout from "./layout";

export default function Home() {
  return (
    <RootLayout>
      <MainSidebarLayout>
        <MainPage />
      </MainSidebarLayout>
    </RootLayout>
  );
}

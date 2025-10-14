import MainPage from "./(user)/(pages)/mainPage/mainPage";
import MainSidebarLayout from "./(user)/mainSidebar/mainSidebarLayout";
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

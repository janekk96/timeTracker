import styles from "./PageWrapper.module.css";

export interface PageWrapperProps {
  children: React.ReactNode;
}

function PageWrapper({ children }: PageWrapperProps) {
  return (
    <main id="main-content" className={styles.PageWrapper} role="main">
      {children}
    </main>
  );
}

export default PageWrapper;

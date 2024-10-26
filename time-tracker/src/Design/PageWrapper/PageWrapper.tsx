import styles from "./PageWrapper.module.css";

export interface PageWrapperProps {
  children: React.ReactNode;
}

function PageWrapper({ children }: PageWrapperProps) {
  return <div className={styles.PageWrapper}>{children}</div>;
}

export default PageWrapper;

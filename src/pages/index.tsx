import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <img src={require('@site/static/img/word_cloud_logo.png').default} alt="Cloud logo" width="220" />
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
      </div>
    </header>
  );
}

const LibraryGotoCard: React.FC<{
  href: string,
  label: string,
  description: string,
}> = (
  {
    href,
    label,
    description,
  }
) => {
  return (
      <div className="col col--6">
        <div className={clsx('card padding--lg', styles.cardGoTo)}>
          <h1>{label}</h1>
          <p>{description}</p>
          <Link className="button button--secondary float-right"
            to={href}>
              Check out
          </Link>
        </div>
      </div>
  )
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Documentation about Board Meister modules like Marshal, Herald or Antetype">
      <HomepageHeader />
      <section className="container margin-top--lg">
        <div className="row mx-auto">
          <LibraryGotoCard
            href="/docs/marshal"
            description={"Marshal is a swappable, scopeable, dynamic, client side plugin manager packaged "
              + "with dependency injection."}
            label="Marshal"/>
          <LibraryGotoCard
            href="/docs/herald"
            description={"Herald is a asynchronous, prioritizable event handler. It allows you to trigger "
              + "asynchronous events in a specific order."}
            label="Herald"/>
        </div>
      </section>
    </Layout>
  );
}

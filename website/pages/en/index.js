/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const CompLibrary = require('../../core/CompLibrary.js');

const MarkdownBlock = CompLibrary.MarkdownBlock; /* Used to read markdown */
const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

class HomeSplash extends React.Component {
  render() {
    const {siteConfig, language = ''} = this.props;
    const {baseUrl, docsUrl} = siteConfig;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
    const langPart = `${language ? `${language}/` : ''}`;
    const docUrl = doc => `${baseUrl}${docsPart}${langPart}${doc}`;

    const SplashContainer = props => (
      <div className="homeContainer paddingTop paddingBottom">
        <div className="homeSplashFade">
          <div className="wrapper homeWrapper">{props.children}</div>
        </div>
      </div>
    );

    const Logo = props => (
      <div className="projectLogo">
        <img src={props.img_src} alt="Project Logo" />
      </div>
    );

    const ProjectTitle = () => (
      <h2 className="projectTitle" style={{fontSize: "64px", fontWeight:"400", lineHeight: "1.25", fontFamily: "'Rubik',Helvetica,Arial,Lucida,sans-serif"}}>
        Unleash high performance<br />
        and fault tolerant super powers<br />
        to streams
        <p style={{fontSize: "25px", paddingTop: "5px"}}>
        StreamsDB is the modern stream database for advanced stream processing and event sourcing systems
        </p>
        <Button href="/docs/">Getting Started</Button>
      </h2>
    );

    const PromoSection = props => (
      <div className="section promoSection">
        <div className="promoRow">
          <div className="pluginRowBlock">{props.children}</div>
        </div>
      </div>
    );

    const Button = props => (
      <div className="pluginWrapper buttonWrapper">
        <a className="button" href={props.href} target={props.target}>
          {props.children}
        </a>
      </div>
    );

    return (
      <SplashContainer>
        <div className="inner">
          <ProjectTitle siteConfig={siteConfig} />
        </div>
      </SplashContainer>
    );
  }
}

class Index extends React.Component {
  render() {
    const {config: siteConfig, language = ''} = this.props;
    const {baseUrl} = siteConfig;

    const Block = props => (
      <Container
        padding={['bottom', 'top']}
        id={props.id}
        background={props.background}>
        <GridBlock
          align="center"
          contents={props.children}
          layout={props.layout}
        />
      </Container>
    );

   
    const Features = () => (
      <div>
      <Block layout="threeColumn" background="light">
        {[
          {
            content: 'StreamsDB provides a rock solid foundation for event-sourced applications that store their state as a series of events.',
            image: `${baseUrl}img/undraw_Posts_rskc.svg`,
            imageAlign: 'top',
            title: 'Event Sourcing',
          },
          {
            content: 'StreamsDB offers amazing performance on commodity hardware, allowing you to support heavy loads at minimal costs.',
            image: `${baseUrl}img/undraw_To_the_stars_qhyy.svg`,
            imageAlign: 'top',
            title: 'Industry-leading performance',
          },
          {
            content: 'StreamsDB can replicate to multiple machines, across availability zones and even across datacenters.',
            image: `${baseUrl}img/undraw_secure_server_s9u8.svg`,
            imageAlign: 'top',
            title: 'Fault tolerant',
          },
        ]}
        </Block>
        <Block layout="threeColumn" background="light">
        {[
          {
            content: 'StreamsDB has a distributed architecture that self balances and gracefully scales out horizontaly.',
            image: `${baseUrl}img/undraw_fast_loading_0lbh.svg`,
            imageAlign: 'top',
            title: 'Easily scalable',
          },
          {
            content: 'StreamsDB provides the ability to subscribe streams for changes with low latency and minimal resource costs.',
            image: `${baseUrl}img/undraw_timeline_9u4u.svg`,
            imageAlign: 'top',
            title: 'Change Notification',
          },
          {
            content: 'We provide cost efficient cloud instances of StreamsDB so you can focus on what really matters, your software.',
            image: `${baseUrl}img/undraw_server_status_5pbv.svg`,
            imageAlign: 'top',
            title: 'Cloud Native',
          },
        ]}
        </Block>
        <Block layout="threeColumn" background="light">
        {[
          {
            content: 'StreamsDB is built with proven technologies that are battle tested and ready for the toughest tasks.',
            image: `${baseUrl}img/undraw_QA_engineers_dg5p.svg`,
            imageAlign: 'top',
            title: 'Built with standards',
          },
          {
            content: 'StreamsDB allows you write to multiple streams within a single transaction secure and efficient.',
            image: `${baseUrl}img/undraw_version_control_9bpv.svg`,
            imageAlign: 'top',
            title: 'Transaction support',
          },
          {
            content: 'StreamsDB has client support for [Go](/docs/getting-started-go), [.NET](https://streamsdb.io/docs/getting-started-dotnet), NodeJS and Java.',
            image: `${baseUrl}img/undraw_Designer_by46.svg`,
            imageAlign: 'top',
            title: 'Major platform support',
          },
        ]}
      </Block>
      </div>
    );

    return (
      <div>
        <HomeSplash siteConfig={siteConfig} language={language} />
        <Features />
      </div>
    );
  }
}

module.exports = Index;

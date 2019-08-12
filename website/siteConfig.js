/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// See https://docusaurus.io/docs/site-config for all the possible
// site configuration options.

// List of projects/orgs using your project for the users page.
const users = [
  {
    caption: 'User1',
    // You will need to prepend the image path with your baseUrl
    // if it is not '/', like: '/test-site/img/image.jpg'.
    image: '/img/undraw_open_source.svg',
    infoLink: 'https://www.facebook.com',
    pinned: true,
  },
];

const siteConfig = {
  title: 'StreamsDB', // Title for your website.
  tagline: 'The place where streams feel at home 💕',
  url: 'https://streamsdb.io', // Your website URL
  editUrl: 'https://github.com/streamsdb/site/edit/master/docs/',
  baseUrl: '/', // Base URL for your project */
  // For github.io type URLs, you would set the url and baseUrl like:
  //   url: 'https://facebook.github.io',
  //   baseUrl: '/test-site/',

  // Used for publishing and more
  projectName: 'StreamsDB',
  organizationName: 'streamsdb',
  // For top-level user or org sites, the organization is still the same.
  // e.g., for the https://JoelMarcey.github.io site, it would be set like...
  //   organizationName: 'JoelMarcey'

  // For no header links in the top nav bar -> headerLinks: [],
  headerLinks: [
    {href: '/join', label: 'Join'},
    {href: '/chat', label: 'Chat'},
    {href: '/docs', label: 'Docs'},
    //{page: 'help', label: 'Help'},
    //{blog: true, label: 'Blog'},
  ],

  stylesheets: [
    "https://fonts.googleapis.com/css?family=Rubik%3A300%2C300italic%2Cregular%2Citalic%2C500%2C500italic%2C700%2C700italic%2C900%2C900italic&amp;ver=5.2.1#038;subset=cyrillic,hebrew,latin,latin-ext",
    'https://docusaurus.io/style.css',
    {
      href: '/css/custom.css',
      type: 'text/css',
    },
  ],

  /* path to images for header/footer */
  headerIcon: 'img/logo.svg',
  footerIcon: 'img/logo.svg',
  favicon: 'img/favicon.ico',

  gaTrackingId: 'UA-143880638-1',
  gaGtag: true,

  /* Colors for website */
  colors: {
    primaryColor: '#0091ea',
    secondaryColor: '#2BAEFC',
  },

  /* Custom fonts for website */
  /*
  fonts: {
    myFont: [
      "Times New Roman",
      "Serif"
    ],
    myOtherFont: [
      "-apple-system",
      "system-ui"
    ]
  },
  */

  // This copyright info is used in /core/Footer.js and blog RSS/Atom feeds.
  copyright: `Copyright © ${new Date().getFullYear()} StreamsDB`,

  highlight: {
    // Highlight.js theme to use for syntax highlighting in code blocks.
    theme: 'default',
  },

  // Add custom scripts here that would be placed in <script> tags.
  scripts: ['https://buttons.github.io/buttons.js'],

  // On page navigation for the current documentation page.
  onPageNav: 'separate',
  // No .html extensions for paths.
  cleanUrl: true,

  // Open Graph and Twitter card images.
  ogImage: 'img/logo-blue-bg.svg',
  twitterImage: 'img/logo-blue-bg.svg',

  // Show documentation's last contributor's name.
  // enableUpdateBy: true,

  // Show documentation's last update time.
  // enableUpdateTime: true,

  // You may provide arbitrary config keys to be used as needed by your
  // template. For example, if you need your repo's URL...
  repoUrl: 'https://github.com/streamsdb/site',
};

module.exports = siteConfig;

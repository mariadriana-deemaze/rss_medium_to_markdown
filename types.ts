export type ItemData = {
 id: string;
 link: string;
 slug: string;
 date: string;
 categories: string[];
 title: string;
 description: string;
 content: string;
 markdown: string;
}
// Record<string,any>
export type RSSItem = {
 title: string[],
 link: string[],
 guid: {
  _: string
  '$': { isPermaLink: string }
 }[],
 category: string[],
 'dc:creator': string[],
 pubDate: string[],
 'atom:updated': string[],
 'content:encoded': string[]
}

export type ParsedFeed = { rss: any, channel: object[] }
/* 
export type MediumFeedItem = {
 title: string[],
 link: string[],
 guid: Object[][],
 category: string[],
 'dc:creator': string[],
 pubDate: string[],
 'atom:updated': string[],
 'content:encoded': string[]
}
 */

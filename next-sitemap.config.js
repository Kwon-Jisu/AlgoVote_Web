/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.algovote.kr', // 여기에 실제 사이트 URL을 입력하세요
  generateRobotsTxt: false, // robots.txt가 이미 있으므로 false로 설정
  sitemapSize: 7000,
  exclude: ['/api/*', '/_next/*'],
  generateIndexSitemap: true,
  alternateRefs: [],
  outDir: 'public',
  transform: async (config, path) => {
    // 특정 페이지에 대한 우선순위 및 변경 빈도 커스터마이징
    if (path === '/') {
      return {
        loc: path,
        changefreq: 'daily',
        priority: 1.0,
        lastmod: new Date().toISOString(),
      };
    }
    
    // 후보자 페이지는 높은 우선순위
    if (path.startsWith('/candidates/')) {
      return {
        loc: path,
        changefreq: 'weekly',
        priority: 0.8,
        lastmod: new Date().toISOString(),
      };
    }
    
    // 비교 및 소개 페이지
    if (path === '/compare' || path === '/about') {
      return {
        loc: path,
        changefreq: 'weekly',
        priority: 0.7,
        lastmod: new Date().toISOString(),
      };
    }

    return {
      loc: path,
      changefreq: 'monthly',
      priority: 0.5,
      lastmod: new Date().toISOString(),
    };
  },
}; 
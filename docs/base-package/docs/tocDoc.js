const {startCase, upperFirst, lowerCase} = require('lodash');

module.exports = exports = class TocDoc {
  constructor(contents) {
    this.name = 'TableOfContents';
    this.docType = 'toc';
    this.contents = contents.reduce((curr, doc) => {
      const {computedName, chapter, nochapter, order} = doc;
      let extra = {};
      const title = doc.docType === 'markdown'
        ? upperFirst(lowerCase(computedName))
        : startCase(computedName).replace(/ /g, '');
      let menu = doc.docType !== 'const' ? title : doc.name;
      if (doc.ngType === 'component') {
        menu = '<' + doc.computedName.replace(/-component$/, '') + '>';
      }
      if (['markdown', 'type-alias', 'const'].indexOf(doc.docType) === -1) {
        extra = {
          topics: doc.members.reduce((curr, m) => {
            if (m.description) {
              curr.push(m.name)
            }
            return curr;
          }, [])
        };
      } else if (doc.docType === 'markdown') {
        const topics = doc.content
          .split(/\r\n|\r|\n/)
          .reduce((curr, line) => {
            const match = /^#{3,5}\s+([A-Za-z0-9_ ]+)$/.exec(line);
            if (match) {
              curr.push(match[1]);
            }
            return curr;
          }, []);
        extra = {topics};
      }
      const contentItem = {
        title,
        menu,
        order: order || 0,
        path: computedName,
        chapter: nochapter ? '' : upperFirst(chapter),
        section: doc.location || '',
        url: doc.location ? `/${chapter}/${doc.location}/${computedName}` : `/${chapter}/${computedName}`,
        ...extra
      };
      if (!order) {
        curr.push(contentItem);
      } else {
        const following = curr.findIndex(t => t.chapter === contentItem.chapter
          && t.section === contentItem.section
          && t.order > contentItem.order);
        if (following === -1) {
          curr.push(contentItem)
        } else {
          curr.splice(following !== 0 ? following : 0, 0, contentItem)
        }
      }
      return curr;
    }, []);
    this.template = 'toc-data.ts'
  }
};
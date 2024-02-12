module Jekyll
    class AllPostsGenerator < Generator
      safe true
  
      def generate(site)
        site.collections['all'] = Collection.new(site, 'all')
        site.collections['all'].docs = site.collections.values.flat_map(&:docs)
      end
    end
end
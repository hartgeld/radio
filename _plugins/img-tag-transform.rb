[:posts, :shows].each do |doc_type|
    Jekyll::Hooks.register doc_type, :pre_render do |doc, payload|
      docExt = doc.extname.tr('.', '')
      doc.content.gsub!(/!\[(.*)\]\(([^\)]+)\)(?:{:([^}]+)})*/, '{% responsive_image path: \2 \3 %}')
      doc.content.gsub! 'path: /', 'path: ' #you can probably optimise this a bit
    end
  end
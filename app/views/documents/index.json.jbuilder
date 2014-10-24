json.array!(@documents) do |document|
  json.extract! document, :id, :source, :folder, :bundleid, :bundlenum, :itemid, :pages, :ocr, :adjust, :date, :creator, :addressee, :type, :copytype, :script, :envelope, :title, :summary, :notes, :tags, :answers, :answeredby, :hascopy, :copyof
  json.url document_url(document, format: :json)
end

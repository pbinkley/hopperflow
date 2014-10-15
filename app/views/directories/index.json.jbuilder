json.array!(@directories) do |directory|
  json.extract! directory, :id, :dirpath
  json.url directory_url(directory, format: :json)
end

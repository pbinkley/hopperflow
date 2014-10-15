json.array!(@images) do |image|
  json.extract! image, :id, :basename, :extension, :width, :height, :size, :directory_id
  json.url image_url(image, format: :json)
end

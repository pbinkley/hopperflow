class AddFormatToImages < ActiveRecord::Migration
  def change
    add_column :images, :format, :string
  end
end

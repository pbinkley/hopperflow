class AddControlsToImages < ActiveRecord::Migration
  def change
	 add_column :images, :modify, :integer, default: 0
	 add_column :images, :deskew, :boolean, default: :false
	 add_column :images, :split, :boolean, default: :false
  end
end

class AddImagesAssociationToDocument < ActiveRecord::Migration
  def self.up
        add_column :images, :document_id, :integer
        add_index 'images', ['document_id'], :name => 'index_document_id' 
  end

  def self.down
        remove_column :images, :document_id
  end
end

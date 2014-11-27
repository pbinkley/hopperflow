require 'spec_helper'

describe Image do
	it "has a valid factory" do
		expect(FactoryGirl.build(:image)).to be_valid
	end

	it "is invalid without a basename" do
	  image = FactoryGirl.build(:image, basename: nil)
	  image.valid?
	      expect(image.errors[:basename]).to include("can't be blank")
	end

	it "has association with document" do
		document = FactoryGirl.build(:document, title: "Document 1")
		document.save
		image = FactoryGirl.build(:image, basename: "Image 1", document_id: document.id)
		image.save
		document.reload
		expect(document.images[0].basename).to eq("Image 1")
	end

	it "loses association with document" do
		document = FactoryGirl.build(:document, title: "Document 1")
		document.save
		image = FactoryGirl.build(:image, basename: "Image 1", document_id: document.id)
		image.save
		image.update({"document_id" => nil})
		image.save
		document.reload
		expect(document.images.size).to eq(0)
	end
## more specs
end

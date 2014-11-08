class DirectoriesController < ApplicationController
  before_action :set_directory, only: [:show, :edit, :update, :destroy]
skip_before_filter  :verify_authenticity_token
  # GET /directories
  # GET /directories.json
  def index
    @directories = Directory.all
  end

  # GET /directories/1
  # GET /directories/1.json
  def show
      @images = @directory.images
  end

  # GET /directories/new
  def new
	@directory = Directory.new
  end

  # GET /directories/1/edit
  def edit
  end

  # POST /directories
  # POST /directories.json
  def create
	require 'RMagick'
	@directory = Directory.new(directory_params)
	
	if @directory.valid?
	
		# set and test dirpath
		dirpath = Pathname(@directory.dirpath)
		
		# note that dirpath is a Path, therefore handles separators automatically
		hopperdir = dirpath + "hopperflow"
		displaysdir = hopperdir + "displays"
		thumbsdir = hopperdir + "thumbs"
		# create originals, thumbs and displays directories
		Dir.mkdir(hopperdir) unless File.exists?(hopperdir)
		Dir.mkdir(displaysdir) unless File.exists?(displaysdir)
		Dir.mkdir(thumbsdir) unless File.exists?(thumbsdir)

		@directory.save
		
		# for each image, create thumb and display derivative
		Dir.glob(dirpath + "*") do |file|

			# use rmagick to determine whether this file is an image
			begin
				# open file as an image - will raise exception if it isn't
				img = Magick::Image::read(file).first
				
				if img.format != 'TXT'
					extension = File.extname(file) # e.g. ".jpg"
					basename = File.basename(file, extension)
						
					# add image to db
					i = @directory.images.create(
						extension: extension,
						basename: basename,
						width: img.rows,
						height: img.columns,
						size: File.size(file),
						format: img.format
					)
					
					img.resize_to_fit(800,800).write dirpath + "hopperflow" + "displays" + "#{basename}.jpg"
					img.resize_to_fit(200,200).write dirpath + "hopperflow" + "thumbs" + "#{basename}.gif"
				end				
			rescue Exception => e
				# do nothing - it's not an image
			end
		end
	end
	respond_to do |format|
		if @directory.save
			format.html { redirect_to @directory, notice: 'Directory was successfully created.' }
			format.json { render :show, status: :created, location: @directory }
		else
			format.html { render :new }
			format.json { render json: @image.errors, status: :unprocessable_entity }
		end
	end
  end

  # PATCH/PUT /directories/1
  # PATCH/PUT /directories/1.json
  def update
    respond_to do |format|
      if @directory.update(directory_params)
        format.html { redirect_to @directory, notice: 'Directory was successfully updated.' }
        format.json { render :show, status: :ok, location: @directory }
      else
        format.html { render :edit }
        format.json { render json: @directory.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /directories/1
  # DELETE /directories/1.json
  def destroy
    @directory.destroy
    respond_to do |format|
      format.html { redirect_to directories_url, notice: 'Directory was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_directory
      @directory = Directory.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def directory_params
      params.require(:directory).permit(:dirpath)
    end
end

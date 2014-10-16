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

	# set and test dirpath
	dirpath = Pathname(@directory.dirpath)
	raise RuntimeError, dirpath + " does not exist" unless dirpath.exist?
	raise RuntimeError, dirpath + " is not a directory" unless dirpath.directory?
	raise RuntimeError, dirpath + " is not readable" unless dirpath.readable?
	raise RuntimeError, dirpath + " is not writable" unless dirpath.writable?
	
	# dirpath is ok, so save this directory
	@directory.save

	# note that dirpath is a Path, therefore handles separators automatically
	hopperdir = dirpath + "hopperflow"
	displaysdir = hopperdir + "displays"
	thumbsdir = hopperdir + "thumbs"
	# create originals, thumbs and displays directories
	Dir.mkdir(hopperdir) unless File.exists?(hopperdir)
	Dir.mkdir(displaysdir) unless File.exists?(displaysdir)
	Dir.mkdir(thumbsdir) unless File.exists?(thumbsdir)
	  
	# for each image, create thumb and display derivative
	Dir.glob(dirpath + "*.jpg") do |file|
		  # TODO use rmagick to determine whether this file is an image
		  extension = File.extname(file) # .jpg
		  basename = File.basename(file, extension)
		  dir = File.dirname(file)
		  img = Magick::Image::read(file).first
		  width = img.rows
		  height = img.columns
		  # add image to db
		  i = @directory.images.create(
		  	basename: basename, 
		  	extension: extension, 
		  	width: width, 
		  	height: height)
							
		  # create derivative images
		  img.resize_to_fit(800,800).write displaysdir + "#{basename}.jpg"
		  img.resize_to_fit(200,200).write thumbsdir + "#{basename}.gif"
	 end
	 redirect_to @directory, notice: 'Directory was successfully created.'
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

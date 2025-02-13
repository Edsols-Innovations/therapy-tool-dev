import os

def rename_images_to_png(directory):
    """
    Renames all .jpg and .jpeg files in the specified directory to .png.

    Args:
        directory (str): The path to the directory containing images.
    """
    # Check if the directory exists
    if not os.path.isdir(directory):
        print(f"The directory '{directory}' does not exist.")
        return

    # Iterate through files in the directory
    for filename in os.listdir(directory):
        if filename.lower().endswith(('.jpg', '.jpeg')):
            # Construct full file path
            file_path = os.path.join(directory, filename)
            # New file path with .png extension
            new_filename = os.path.splitext(filename)[0] + '.png'
            new_file_path = os.path.join(directory, new_filename)
            # Rename the file
            try:
                os.rename(file_path, new_file_path)
                print(f"Renamed '{filename}' to '{new_filename}'.")
            except Exception as e:
                print(f"Failed to rename '{filename}': {e}")

# Example usage:
if __name__ == "__main__":
    # Replace 'path/to/your/directory' with the directory path containing your images
    directory_path = input("Enter the directory path containing your images: ")
    rename_images_to_png(directory_path)

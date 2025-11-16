import os
import csv

def create_csv_from_folder(FOLDER_NAME, LABEL, OUTPUT_CSV):
    """
    Create a CSV file from the contents of a folder.

    ARGS:
        FOLDER_NAME [str]: Path to the folder containing the dataset.
        LABEL [str]: Label corresponding to the data.
        OUTPUT_CSV [str]: Path to the output CSV file.
    """

    # List all files in the folder
    files = os.listdir(FOLDER_NAME)
    
    # Open the CSV file for writing
    with open(OUTPUT_CSV, mode='w', newline='', encoding='utf-8') as csv_file:
        writer = csv.writer(csv_file)
        
        # Write the header row (customize as needed)
        writer.writerow(['Filepath', 'Label'])  # Add more columns if needed
        
        # Iterate through the files and write their information to the CSV
        for file_name in files:
            # Skip directories or hidden files if necessary
            if os.path.isfile(os.path.join(FOLDER_NAME, file_name)):
                # Write the filepath and label to the CSV
                filepath = os.path.join(FOLDER_NAME, file_name)
                writer.writerow([filepath, LABEL])

def populate_csv_file(OUTPUT_CSV, FOLDER_NAME, LABEL):
    """
    Populate an existing CSV file with data from a folder.

    ARGS:
        OUTPUT_CSV [str]: Path to the output CSV file.
        FOLDER_NAME [str]: Path to the folder containing the dataset.
        LABEL [str]: Label corresponding to the data.
    """

    # List all files in the folder
    files = os.listdir(FOLDER_NAME)
    
    # Open the CSV file for appending
    with open(OUTPUT_CSV, mode='a', newline='', encoding='utf-8') as csv_file:
        writer = csv.writer(csv_file)
        
        # Iterate through the files and append their information to the CSV
        for file_name in files:
            # Skip directories or hidden files if necessary
            if os.path.isfile(os.path.join(FOLDER_NAME, file_name)):
                # Write the filepath and label to the CSV
                filepath = os.path.join(FOLDER_NAME, file_name)
                writer.writerow([filepath, LABEL])

# Define the dataset folders and corresponding output CSV files
partitions = ['train', 'test', 'val']
labels = {
    'lettuce': ['Lettuce_Diseased', 'Lettuce_Healthy'],
    'cabbage': ['Cabbage_Diseased', 'Cabbage_Healthy'],
    # 'basil': ['Basil_Diseased', 'Basil_Healthy'],
    # 'all_data': ['Diseased', 'Healthy']
}

datasets = {}

for plant, label in labels.items():
    for partition in partitions:
        print(f"\n--- Processing _{plant}_ • {partition} partition ---")
        print(f"| For labels: {label} |")
        
        # Define paths for each label
        diseased_path = os.path.join('..', 'Datasets', plant, partition, label[0])
        print(label[0])
        healthy_path = os.path.join('..', 'Datasets', plant, partition, label[1])
        print(label[1])

        # Define output CSV file paths
        output_csv = os.path.join('..', 'Datasets', plant, f"{plant}_{partition}_labels.csv")

        # Add paths and labels to the datasets dictionary
        datasets[f"{plant}_{partition}_diseased"] = [diseased_path, label[0], output_csv]
        print(f"| {plant}_{partition}_diseased: {datasets[f"{plant}_{partition}_diseased"]} |")
        datasets[f"{plant}_{partition}_healthy"] = [healthy_path, label[1], output_csv]
        print(f"| {plant}_{partition}_healthy: {datasets[f"{plant}_{partition}_healthy"]} |")



# Process each dataset folder
for key, value_list in datasets.items():
    print(f"\n... Iterating through folder _{key}_ ...")
    folder_path, label, output_csv = value_list
    
    # Debugging: Print folder path and output CSV path
    print(f"Checking folder path: {folder_path}")
    print(f"Output CSV path: {output_csv}")
    
    if os.path.exists(folder_path):  # Check if the folder exists
        # Count the number of files in the folder
        num_files = len([f for f in os.listdir(folder_path) if os.path.isfile(os.path.join(folder_path, f))])
        print(f"Folder exists. Number of files: {num_files}")
        
        if os.path.exists(output_csv):
            print(f"| {output_csv} CSV file already exists! Populating data... |")
            populate_csv_file(output_csv, folder_path, label)
            print(f"| {output_csv} CSV file populated! |")

        else:
            create_csv_from_folder(folder_path, label, output_csv)
            print(f"| {output_csv} CSV file created! |")
    else:
        print(f"⚠️ WARNING: Folder {folder_path} does not exist. Skipping...")

print("\n\n🟢 ALL CSV files created successfully!!! 🟢")
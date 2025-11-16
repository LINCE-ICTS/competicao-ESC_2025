# Verificação do recebimento das variáveis do notebook
print("Custom Directory:", custom_dir_3)
print("Partitions:", partitions_2)
print("Categories:", categories_3)

def adjust_classes_cabbage(DATA_SOURCE, CUSTOM_DIR, PARTITIONS):
    '''
    PARAMETERS:
    - CUSTOM_DIR [str]: Path to the custom directory where dataset is downloaded
    - BACTERIAL_FOLDER [str]: Name of the bacterial disease folder
    - FUNGAL_FOLDER [str]: Name of the fungal disease folder
    - PARTITIONS [list]: List of dataset partitions (e.g., ['train', 'test', 'valitoin'])
    
    FUNCTIONALITY:
    |  Rename specific disease folders to general disease categories.
    '''
    import os


    for partition in PARTITIONS:
        print(f"\n--- Processing {partition} folder ---")

        # Define the paths for the Bacterial and Fungal foldersL
        bacterial_folder_3_1 = os.path.join(CUSTOM_DIR, partition, "Cabbage__Black_Rot")
        bacterial_folder_3_2 = os.path.join(CUSTOM_DIR, partition, "Cabbage__Bacterial_spot_rot")
        fungal_folder_3_1 = os.path.join(CUSTOM_DIR, partition, "Cabbage__Alternaria_Leaf_Spot")
        fungal_folder_3_2 = os.path.join(CUSTOM_DIR, partition, "Cabbage__Downy_Mildew")
        fungal_folder_3_3 = os.path.join(CUSTOM_DIR, partition, "Cabbage__ring_spot")

        # Create the diseased folder if it doesn't exist
        diseased_folder_3 = os.path.join(CUSTOM_DIR, partition, "diseased")
        os.makedirs(diseased_folder_3, exist_ok=True)

        # Move all files from Bacterial and Fungal folders to diseased folder
        for folder in [bacterial_folder_3_1, bacterial_folder_3_2, fungal_folder_3_1, fungal_folder_3_2, fungal_folder_3_3]:
            if os.path.exists(folder):
                # Renaming Bacterial files and moving
                if folder == bacterial_folder_3_1:
                    for filename in os.listdir(folder):
                        src = os.path.join(folder, filename)
                        dst = os.path.join(diseased_folder_3, f"{DATA_SOURCE}-bacterial_1_{filename}")
                        if os.path.isfile(src):
                            os.rename(src, dst)
                elif folder == bacterial_folder_3_2:
                    for filename in os.listdir(folder):
                        src = os.path.join(folder, filename)
                        dst = os.path.join(diseased_folder_3, f"{DATA_SOURCE}-bacterial_2_{filename}")
                        if os.path.isfile(src):
                            os.rename(src, dst)
                
                # Renaming Fungal files and moving
                elif folder == fungal_folder_3_1:
                    for filename in os.listdir(folder):
                        src = os.path.join(folder, filename)
                        dst = os.path.join(diseased_folder_3, f"{DATA_SOURCE}-fungal_1_{filename}")
                        if os.path.isfile(src):
                            os.rename(src, dst)
                elif folder == fungal_folder_3_2:
                    for filename in os.listdir(folder):
                        src = os.path.join(folder, filename)
                        dst = os.path.join(diseased_folder_3, f"{DATA_SOURCE}-fungal_2_{filename}")
                        if os.path.isfile(src):
                            os.rename(src, dst)
                elif folder == fungal_folder_3_3:
                    for filename in os.listdir(folder):
                        src = os.path.join(folder, filename)
                        dst = os.path.join(diseased_folder_3, f"{DATA_SOURCE}-fungal_3_{filename}")
                        if os.path.isfile(src):
                            os.rename(src, dst)


adjust_classes_cabbage(DATA_SOURCE="cabbage", CUSTOM_DIR=custom_dir_3, PARTITIONS=partitions_2)

data_structure_preview(CUSTOM_DIR=custom_dir_3, PARTITIONS=partitions_2, CATEGORIES=categories_3)
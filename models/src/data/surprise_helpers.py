from surprise import Dataset, Reader


def generate_trainset(df_interactions):
    reader = Reader(rating_scale=(0, 1))
    dataset = Dataset.load_from_df(
        df_interactions[["user_id", "item_id", "rating"]], reader=reader
    )
    trainset = dataset.build_full_trainset()
    return trainset

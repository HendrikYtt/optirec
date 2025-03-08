import pandas as pd


def load_pandas_df_from_csv(csv_path: str, filter_func=None) -> pd.DataFrame:
    df = pd.read_csv(
        csv_path,
        header=0,
        index_col=0,
        dtype={"id": "string", "user_id": "string", "item_id": "string"},
        iterator=filter_func is not None,
        chunksize=1000 if filter_func is not None else None,
    )

    if filter_func is not None:
        df = pd.concat([chunk[filter_func(chunk)] for chunk in df])

    df = df[~df.index.duplicated(keep="last")]
    return df

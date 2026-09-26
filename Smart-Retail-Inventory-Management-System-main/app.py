import pandas as pd
import plotly.express as px
import streamlit as st

st.set_page_config(page_title="Smart Retail Dashboard", page_icon="🛒", layout="wide")

st.markdown(
    """
    <style>
    .stApp {
        background: linear-gradient(180deg, #020d1d 0%, #071b2e 100%);
        color: #f8fafc;
    }
    .main {
        background: linear-gradient(180deg, #020d1d 0%, #071b2e 100%);
    }
    [data-testid="stSidebar"] {
        background: rgba(9, 20, 37, 0.9);
    }
    div[data-testid="metric-container"] {
        background: rgba(15, 23, 42, 0.82);
        border: 1px solid rgba(148, 163, 184, 0.22);
        border-radius: 12px;
        padding: 16px 14px;
        box-shadow: 0 8px 20px rgba(0,0,0,0.15);
    }
    .stDataFrame {
        background: rgba(15, 23, 42, 0.7);
        border-radius: 12px;
        border: 1px solid rgba(148, 163, 184, 0.22);
    }
    .stHeader {
        color: #f8fafc;
    }
    .stPlotlyChart {
        background: transparent;
    }
    </style>
    """,
    unsafe_allow_html=True,
)

products = [
    {"_id": "prod_01", "productName": "Wireless Noise-Canceling Headphones", "category": "Electronics", "price": 199.99, "quantity": 24, "minStockLevel": 10, "supplier": "TechSource Logistics"},
    {"_id": "prod_02", "productName": "Smart Ergonomic Keyboard", "category": "Electronics", "price": 129.5, "quantity": 5, "minStockLevel": 8, "supplier": "TechSource Logistics"},
    {"_id": "prod_03", "productName": 'Ultra HD 4K Monitor 27"', "category": "Electronics", "price": 349.0, "quantity": 3, "minStockLevel": 5, "supplier": "TechSource Logistics"},
    {"_id": "prod_04", "productName": "Organic Cold Brew Coffee (12 Pack)", "category": "Beverages", "price": 32.99, "quantity": 45, "minStockLevel": 15, "supplier": "Organic Harvest Co."},
    {"_id": "prod_05", "productName": "Artisan Matcha Powder 100g", "category": "Groceries", "price": 24.0, "quantity": 4, "minStockLevel": 10, "supplier": "Organic Harvest Co."},
    {"_id": "prod_06", "productName": "Breathable Running Shoes (Size 10)", "category": "Footwear", "price": 89.99, "quantity": 18, "minStockLevel": 6, "supplier": "Urban Wear Distributors"},
    {"_id": "prod_07", "productName": "Bluetooth Speaker Mini Pro", "category": "Electronics", "price": 79.99, "quantity": 11, "minStockLevel": 9, "supplier": "TechSource Logistics"},
    {"_id": "prod_08", "productName": "Vitamin C Wellness Pack", "category": "Health", "price": 45.0, "quantity": 7, "minStockLevel": 12, "supplier": "CareWell Supply"},
    {"_id": "prod_09", "productName": "Cotton Workout T-Shirt", "category": "Apparel", "price": 27.5, "quantity": 26, "minStockLevel": 8, "supplier": "Urban Wear Distributors"},
    {"_id": "prod_10", "productName": "Portable USB-C Charger", "category": "Accessories", "price": 19.99, "quantity": 14, "minStockLevel": 10, "supplier": "TechSource Logistics"},
    {"_id": "prod_11", "productName": "Organic Green Tea Box", "category": "Beverages", "price": 18.5, "quantity": 9, "minStockLevel": 10, "supplier": "Organic Harvest Co."},
    {"_id": "prod_12", "productName": "Smart Fitness Tracker", "category": "Health", "price": 149.0, "quantity": 16, "minStockLevel": 7, "supplier": "CareWell Supply"},
]

suppliers = [
    {"supplierName": "TechSource Logistics", "contact": "+1 (555) 019-2834", "email": "contact@techsource.io", "categories": ["Electronics", "Accessories"]},
    {"supplierName": "Organic Harvest Co.", "contact": "+1 (555) 014-9988", "email": "sales@organicharvest.com", "categories": ["Groceries", "Beverages"]},
    {"supplierName": "Urban Wear Distributors", "contact": "+1 (555) 018-7711", "email": "info@urbanwear.com", "categories": ["Apparel", "Footwear"]},
    {"supplierName": "CareWell Supply", "contact": "+1 (555) 036-4477", "email": "support@carewell.com", "categories": ["Health", "Wellness"]},
]

sales = [
    {"_id": "sale_01", "productId": "prod_01", "productName": "Wireless Noise-Canceling Headphones", "quantity": 3, "unitPrice": 199.99, "totalPrice": 599.97, "saleDate": "2025-08-05T10:15:00", "recordedBy": "Dwight Schrute (Employee)"},
    {"_id": "sale_02", "productId": "prod_04", "productName": "Organic Cold Brew Coffee (12 Pack)", "quantity": 5, "unitPrice": 32.99, "totalPrice": 164.95, "saleDate": "2025-08-08T14:00:00", "recordedBy": "Dwight Schrute (Employee)"},
    {"_id": "sale_03", "productId": "prod_06", "productName": "Breathable Running Shoes (Size 10)", "quantity": 1, "unitPrice": 89.99, "totalPrice": 89.99, "saleDate": "2025-08-12T09:30:00", "recordedBy": "Dwight Schrute (Employee)"},
    {"_id": "sale_04", "productId": "prod_02", "productName": "Smart Ergonomic Keyboard", "quantity": 3, "unitPrice": 129.5, "totalPrice": 388.5, "saleDate": "2025-08-15T16:45:00", "recordedBy": "Dwight Schrute (Employee)"},
    {"_id": "sale_05", "productId": "prod_09", "productName": "Cotton Workout T-Shirt", "quantity": 4, "unitPrice": 27.5, "totalPrice": 110.0, "saleDate": "2025-08-18T11:25:00", "recordedBy": "Dwight Schrute (Employee)"},
    {"_id": "sale_06", "productId": "prod_10", "productName": "Portable USB-C Charger", "quantity": 6, "unitPrice": 19.99, "totalPrice": 119.94, "saleDate": "2025-08-20T13:10:00", "recordedBy": "Dwight Schrute (Employee)"},
    {"_id": "sale_07", "productId": "prod_12", "productName": "Smart Fitness Tracker", "quantity": 2, "unitPrice": 149.0, "totalPrice": 298.0, "saleDate": "2025-08-22T15:40:00", "recordedBy": "Dwight Schrute (Employee)"},
    {"_id": "sale_08", "productId": "prod_07", "productName": "Bluetooth Speaker Mini Pro", "quantity": 5, "unitPrice": 79.99, "totalPrice": 399.95, "saleDate": "2025-08-24T12:00:00", "recordedBy": "Dwight Schrute (Employee)"},
    {"_id": "sale_09", "productId": "prod_05", "productName": "Artisan Matcha Powder 100g", "quantity": 2, "unitPrice": 24.0, "totalPrice": 48.0, "saleDate": "2025-08-26T09:10:00", "recordedBy": "Dwight Schrute (Employee)"},
    {"_id": "sale_10", "productId": "prod_08", "productName": "Vitamin C Wellness Pack", "quantity": 3, "unitPrice": 45.0, "totalPrice": 135.0, "saleDate": "2025-08-28T10:50:00", "recordedBy": "Dwight Schrute (Employee)"},
]

products_df = pd.DataFrame(products)
sales_df = pd.DataFrame(sales)
sales_df["saleDate"] = pd.to_datetime(sales_df["saleDate"])

products_df["inventory_value"] = products_df["price"] * products_df["quantity"]
products_df["stock_status"] = products_df.apply(
    lambda row: "Low Stock" if row["quantity"] <= row["minStockLevel"] else "Healthy",
    axis=1,
)

low_stock = products_df[products_df["quantity"] <= products_df["minStockLevel"]].copy()

st.sidebar.header("Retail Filters")
st.sidebar.markdown("---")
selected_category = st.sidebar.selectbox("Category", ["All"] + sorted(products_df["category"].unique()))
show_only_low_stock = st.sidebar.checkbox("Focus on low stock", value=False)

filtered_products = products_df.copy()
if selected_category != "All":
    filtered_products = filtered_products[filtered_products["category"] == selected_category]
if show_only_low_stock:
    filtered_products = filtered_products[filtered_products["quantity"] <= filtered_products["minStockLevel"]]

filtered_sales = sales_df.copy()
if selected_category != "All":
    filtered_sales = filtered_sales[filtered_sales["productName"].isin(products_df.loc[products_df["category"] == selected_category, "productName"])]

summary_products = filtered_products if not filtered_products.empty else products_df
summary_sales = filtered_sales if not filtered_sales.empty else sales_df

revenue_total = float(summary_sales["totalPrice"].sum()) if not summary_sales.empty else 0.0
stock_total = int(summary_products["quantity"].sum()) if not summary_products.empty else 0
inventory_total = float(summary_products["inventory_value"].sum()) if not summary_products.empty else 0.0
low_stock_count = int((summary_products["quantity"] <= summary_products["minStockLevel"]).sum()) if not summary_products.empty else 0

monthly_revenue = (
    summary_sales.assign(month=summary_sales["saleDate"].dt.strftime("%b"))
    .groupby("month", as_index=False)["totalPrice"]
    .sum()
)

category_stock = summary_products.groupby("category", as_index=False)["quantity"].sum().rename(columns={"quantity": "items"})
recent_sales = summary_sales.sort_values("saleDate", ascending=False).head(5)

st.title("Smart Retail Inventory Management System")
st.markdown("---")

metric_cols = st.columns(4)
metric_cols[0].metric("Total Products", len(summary_products))
metric_cols[1].metric("Items In Stock", stock_total)
metric_cols[2].metric("Low Stock Items", low_stock_count)
metric_cols[3].metric("Revenue", f"${revenue_total:,.2f}")

st.markdown("---")

left_col, right_col = st.columns([2, 1])

with left_col:
    st.subheader("Recent Sales", divider="rainbow")
    if recent_sales.empty:
        st.info("No sales available.")
    else:
        recent_table = recent_sales[["productName", "quantity", "unitPrice", "totalPrice", "saleDate", "recordedBy"]].rename(
            columns={
                "productName": "Product",
                "quantity": "Qty",
                "unitPrice": "Unit Price",
                "totalPrice": "Total Price",
                "saleDate": "Date",
                "recordedBy": "Sold By",
            }
        )
        st.dataframe(recent_table, hide_index=True, width=800)

with right_col:
    st.subheader("Low Stock Alerts", divider="rainbow")
    low_alerts = low_stock[low_stock["productName"].isin(summary_products["productName"])][["productName", "category", "quantity", "minStockLevel"]]
    if low_alerts.empty:
        st.success("All products are above minimum stock levels.")
    else:
        st.dataframe(low_alerts.rename(columns={"productName": "Product", "category": "Category", "quantity": "Qty", "minStockLevel": "Min Level"}), hide_index=True, width=500)

st.markdown("---")

st.subheader("Inventory Detail")
inventory_table = summary_products[["productName", "category", "price", "quantity", "minStockLevel", "supplier", "stock_status"]].rename(
    columns={
        "productName": "Product",
        "category": "Category",
        "price": "Price",
        "quantity": "Qty",
        "minStockLevel": "Min Level",
        "supplier": "Supplier",
        "stock_status": "Status",
    }
)
st.dataframe(inventory_table, hide_index=True, width=1400)

st.markdown("---")

st.subheader("Supplier Overview")
supplier_df = pd.DataFrame(suppliers)
supplier_display = supplier_df[["supplierName", "contact", "email", "categories"]].rename(
    columns={
        "supplierName": "Supplier",
        "contact": "Contact",
        "email": "Email",
        "categories": "Product Categories",
    }
)
supplier_display["Product Categories"] = supplier_display["Product Categories"].apply(lambda cats: " ".join(cats) if isinstance(cats, list) else cats)
st.dataframe(supplier_display, hide_index=True, width=1200)

st.markdown("---")

st.subheader("Business Summary")
summary_col1, summary_col2, summary_col3 = st.columns(3)
summary_col1.metric("Inventory Value", f"${inventory_total:,.2f}")
summary_col2.metric("Avg Unit Price", f"${(summary_products['price'].mean() if not summary_products.empty else 0):,.2f}")
summary_col3.metric("Healthy Stock Ratio", f"{((summary_products['quantity'] > summary_products['minStockLevel']).mean() * 100 if not summary_products.empty else 0):.0f}%")

st.caption("Smart Retail Inventory Management System")

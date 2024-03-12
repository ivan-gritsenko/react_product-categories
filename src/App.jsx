/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from "react";
import "./App.scss";
import cn from "classnames";

import usersFromServer from "./api/users";
import categoriesFromServer from "./api/categories";
import productsFromServer from "./api/products";

const fullProducts = productsFromServer.map((curProduct) => {
  const category = categoriesFromServer.find(
    (currentCategory) => curProduct.categoryId === currentCategory.id
  ); // find by product.categoryId
  const user = usersFromServer.find((person) => person.id === category.ownerId); // find by category.ownerId
  const fullProduct = {
    ...curProduct,
    category,
    owner: user,
  };

  return fullProduct;
});

function getPreparedProducts(products, { filterName, query }) {
  const queryNormalize = query.trim().toLowerCase();
  let preparedGoods = [...products];

  if (filterName !== "All") {
    preparedGoods = [...products].filter(
      (product) => product.owner.name === filterName
    );
  }

  if (queryNormalize) {
    preparedGoods = preparedGoods.filter((product) => {
      if (product.name.toLowerCase().includes(queryNormalize)) {
        return product;
      }

      return 0;
    });
  }

  return preparedGoods;
}

export const App = () => {
  const [filterName, setFilterName] = useState("All");
  const [query, setQuery] = useState("");
  const preparedProducts = getPreparedProducts(fullProducts, {
    filterName,
    query,
  });

  const resetListSorting = () => {
    setFilterName("All");
    setQuery("");
  };

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                className={cn({ "is-active": filterName === "All" })}
                data-cy="FilterAllUsers"
                href="#/"
                onClick={() => setFilterName("All")}
              >
                All
              </a>

              {usersFromServer.map((user) => (
                <a
                  className={cn({ "is-active": user.name === filterName })}
                  data-cy="FilterUser"
                  href="#/"
                  key={user.id}
                  onClick={() => setFilterName(user.name)}
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  value={query}
                  className="input"
                  placeholder="Search"
                  onChange={(event) => {
                    setQuery(event.target.value);
                  }}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {query && (
                  <span className="icon is-right">
                    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      value=""
                      onClick={() => setQuery("")}
                    />
                  </span>
                )}
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className="button is-success mr-6 is-outlined"
              >
                All
              </a>

              {categoriesFromServer.map((category) => (
                <a
                  data-cy="Category"
                  className="button mr-2 my-1 is-info"
                  href="#/"
                >
                  {category.title}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={resetListSorting}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {preparedProducts.length ? (
            <table
              data-cy="ProductTable"
              className="table is-striped is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      ID
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Product
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-down" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Category
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-up" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      User
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {preparedProducts.map((product) => (
                  <tr data-cy="Product" key={product.id}>
                    <td className="has-text-weight-bold" data-cy="ProductId">
                      {product.id}
                    </td>

                    <td data-cy="ProductName">{product.name}</td>
                    <td data-cy="ProductCategory">{`${product.category.icon} - ${product.category.title}`}</td>

                    <td
                      data-cy="ProductUser"
                      className={
                        product.owner.sex === "f"
                          ? "has-text-danger"
                          : "has-text-link"
                      }
                    >
                      {product.owner.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

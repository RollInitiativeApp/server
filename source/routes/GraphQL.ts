import GraphQL from "../data/graphql/graphql";
import core, { Router } from "express";

export default class GraphQLRouteHandler {
	static get router(): core.Router {
		let router = Router();

		GraphQL().then(graphqlMiddleware => {
			router.all("/query", graphqlMiddleware);
		});

		return router;
	}
}

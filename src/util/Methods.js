export const PreviousRouteName = (navigation) => {
    let navRoutes = navigation.dangerouslyGetParent().state.routes;
    if (navRoutes.length >= 2) {
        return navRoutes[navRoutes.length - 2].routeName
    }
    return navigation.state.routeName
}
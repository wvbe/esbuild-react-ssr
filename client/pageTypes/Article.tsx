import React, { FunctionComponent, useEffect, useState } from 'react';

const PageTypeComponent: FunctionComponent<{ data: Record<string, unknown> }> = ({ data }) => {
	return (
		<div>
			<h1>Article</h1>
			{data.title}
		</div>
	);
};

export default PageTypeComponent;

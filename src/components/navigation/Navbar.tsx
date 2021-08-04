import React             from 'react';
import { NavLink, Link } from 'react-router-dom';


interface NavbarProps {
  brand?: string;
}


const Navbar = ({ brand = "inquirED" }: NavbarProps) => {
  const toggleCollapse = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const CLASS_SHOW       = 'show';
    const CLASS_COLLAPSE   = 'collapse';
    const CLASS_COLLAPSING = 'collapsing';
    const CLASS_COLLAPSED  = 'collapsed';
    const ANIMATION_TIME   = 350; // 0.35s
    const el               = e.currentTarget;
    const collapseTargetId = el.dataset.target || null; // Originally was: el.dataset.target || el.href || null;


    if (collapseTargetId){
      const targetEl = document.querySelector(collapseTargetId) as HTMLElement;
      const isShown  = targetEl.classList.contains(CLASS_SHOW) || targetEl.classList.contains(CLASS_COLLAPSING);

      if (!isShown){
        targetEl.classList.remove(CLASS_COLLAPSE);
        targetEl.classList.add(CLASS_COLLAPSING);
        targetEl.style.height = '0';
        targetEl.classList.remove(CLASS_COLLAPSED);

        setTimeout(
          () => {
            targetEl.classList.remove(CLASS_COLLAPSING);
            targetEl.classList.add(CLASS_COLLAPSE, CLASS_SHOW);
            targetEl.style.height = '';
          }, ANIMATION_TIME
        );

        targetEl.style.height = `${targetEl.scrollHeight}px`;
      } else {
        targetEl.style.height = `${targetEl.getBoundingClientRect().height}px`;
        // Force reflow...
        const obligatoryAssignment = targetEl.offsetHeight; // eslint-disable-line

        targetEl.classList.add(CLASS_COLLAPSING);
        targetEl.classList.remove(CLASS_COLLAPSE, CLASS_SHOW);
        targetEl.style.height = '';

        setTimeout(() => {
          targetEl.classList.remove(CLASS_COLLAPSING);
          targetEl.classList.add(CLASS_COLLAPSE);
        }, ANIMATION_TIME);
      }
    }
  }; // End of toggleCollapse()


  return (
    <nav id="primary-navbar" className="navbar navbar-expand-md navbar-dark">
      <div className="container-fluid">
        <Link id="brand" className="navbar-brand font-montserrat" to="/">{brand}</Link>

        <button
          id="custom-toggler"
          className="navbar-toggler custom-toggler"
          type="button"
          data-toggle="collapse"         // Bootstrap 5 uses data-bs-toggle
          data-target="#navbar-collapse" // Bootstrap 5 uses data-bs-target
          onClick={toggleCollapse}
        >
          <span className="navbar-toggler-icon"></span>
        </button>


        <div id="navbar-collapse" className="collapse navbar-collapse">
          <div className="navbar-nav ms-auto">
            <NavLink className="nav-link" activeClassName="active-link" exact to="/admin">Admin</NavLink>
            <NavLink className="nav-link" activeClassName="active-link" exact to="/createuser">Create User</NavLink>
          </div>
        </div>{/* End of <div className collapse navbar-collapse"> */}
      </div>{/* End of <div className="container-fluid"> */}
    </nav>
  );
}


export default Navbar;

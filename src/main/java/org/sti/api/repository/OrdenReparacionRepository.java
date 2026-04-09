package org.sti.api.repository;

import org.sti.api.domain.OrdenReparacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrdenReparacionRepository extends JpaRepository<OrdenReparacion, Long> {
    List<OrdenReparacion> findByVehiculoMatricula(String matricula);
}
